// services/payments.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

import {
  Purchase,
  PurchaseDocument,
  PurchaseStatus,
} from './schemas/purchase.schema';
import { ProductService } from 'src/products/product.service';
import { DiscountService } from 'src/admin/products/discount/discount.service';
import {
  ProductPurchase,
  ProductPurchaseDocument,
} from 'src/productPurchase/schemas/productPurchase.schema';
import { User } from 'src/user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private merchantAccount: string;
  private merchantSecretKey: string;
  private returnUrl: string;
  private serviceUrl: string;
  constructor(
    @InjectModel(Purchase.name)
    private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(ProductPurchase.name)
    private readonly productPurchaseModel: Model<ProductPurchaseDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    private readonly configService: ConfigService,
  ) {
    this.merchantAccount = this.configService.getOrThrow('WFP_MERCHANT');
    this.merchantSecretKey = this.configService.getOrThrow('WFP_SECRET');
    this.returnUrl = this.configService.getOrThrow('WFP_RETURN_URL');
    this.serviceUrl = this.configService.getOrThrow('WFP_CALLBACK_URL');
  }

  async createPayment(dto: any, user?: any) {
    // find product
    const product = await this.productService.getProductDetails(dto.itemId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    let amount = product.price;

    // check for active discount
    const discount = await this.discountService.findDiscount({
      refId: product._id,
    });
    if (discount) {
      amount = product.price - (product.price * discount.discount) / 100;
    }

    const orderReference = `order_${Date.now()}`;

    //check type of product and set targetModule
    const productType = await this.productService.getProductTypeById(
      dto.itemId,
    );

    // if user is authenticated, we can link the purchase to their account

    let purchase: PurchaseDocument;

    if (user) {
      // check if user already has an active purchase for this product
      const existingPurchase = await this.purchaseModel.findOne({
        userId: user._id,
        productId: product._id,
        status: PurchaseStatus.APPROVED,
      });
      if (existingPurchase) {
        throw new BadRequestException(
          'You have already purchased this product',
        );
      }

      // check if user has a pending purchase for this product
      const pendingPurchase = await this.purchaseModel.findOne({
        userId: user._id,
        productId: product._id,
        status: PurchaseStatus.PENDING,
      });
      if (pendingPurchase) {
        throw new BadRequestException(
          'You have a pending purchase for this product. Please complete it before creating a new one.',
        );
      }

      //check if user has a processing purchase for this product
      const processingPurchase = await this.purchaseModel.findOne({
        userId: user._id,
        productId: product._id,
        status: PurchaseStatus.PROCESSING,
      });
      if (processingPurchase) {
        throw new BadRequestException(
          'You have a processing purchase for this product. Please wait for it to complete before creating a new one.',
        );
      }
      //check if user has productPurchase for this product
      const productPurchase = await this.productPurchaseModel.findOne({
        userId: user._id,
        productId: product._id,
      });
      if (productPurchase) {
        throw new BadRequestException(
          'You have already purchased this product. Please check your purchases.',
        );
      }

      purchase = await this.purchaseModel.create({
        orderReference,
        productName: product.name,
        productId: product._id,
        productPrice: product.price,
        productType: productType,
        currency: 'UAH',
        userId: user._id,
        clientEmail: user.email,
        clientPhone: user.phone,
      });
    } else {
      // guest purchase - we won't link it to a user account, but we can still store email and phone for contact

      // check if user has account with this email
      await this.checkExistingUser(dto);

      // check if there's a pending purchase for this email and product
      const existingPurchase = await this.purchaseModel.findOne({
        clientEmail: dto.email,
        productId: product._id,
        status: PurchaseStatus.PENDING,
      });
      if (existingPurchase) {
        throw new BadRequestException(
          'There is already a pending purchase for this email and product. Please complete it before creating a new one.',
        );
      }
      //check if there's a processing purchase for this email and product
      const processingPurchase = await this.purchaseModel.findOne({
        clientEmail: dto.email,
        productId: product._id,
        status: PurchaseStatus.PROCESSING,
      });
      if (processingPurchase) {
        throw new BadRequestException(
          'There is a processing purchase for this email and product. Please wait for it to complete before creating a new one.',
        );
      }
      //check if there's an approved purchase for this email and product
      const approvedPurchase = await this.purchaseModel.findOne({
        clientEmail: dto.email,
        productId: product._id,
        status: PurchaseStatus.APPROVED,
      });
      if (approvedPurchase) {
        throw new BadRequestException(
          'You have already purchased this product with this email. Please check your purchases.',
        );
      }

      purchase = await this.purchaseModel.create({
        orderReference,
        productName: product.name,
        productId: product._id,
        productPrice: product.price,
        productType: productType,
        amount,
        currency: 'UAH',
        clientEmail: dto.email,
        clientPhone: dto.phone,
      });
    }

    const orderDate = Math.floor(Date.now() / 1000);

    const signature = this.generateSignature({
      orderReference,
      orderDate,
      amount,
      productName: purchase.productName,
      productId: purchase.productId,
      productPrice: purchase.productPrice,
      productType,
    });

    return {
      paymentUrl: 'https://secure.wayforpay.com/pay',
      formData: {
        merchantAccount: this.merchantAccount,
        merchantAuthType: 'SimpleSignature',
        merchantSignature: signature,
        orderReference,
        orderDate,
        amount,
        currency: purchase.currency,
        productName: purchase.productName,
        productPrice: purchase.productPrice,
        productId: purchase.productId,
        productType,
        returnUrl: this.returnUrl,
        serviceUrl: this.serviceUrl,
      },
    };
  }

  async handleCallback(data: any) {
    const purchase = await this.purchaseModel.findOne({
      orderReference: data.orderReference,
    });

    if (!purchase) {
      throw new BadRequestException('Order not found');
    }

    if (purchase.processed) {
      return this.successResponse(data.orderReference);
    }

    const expectedSignature = this.generateCallbackSignature(data);

    if (expectedSignature !== data.merchantSignature) {
      throw new BadRequestException('Invalid signature');
    }

    purchase.transactionStatus = data.transactionStatus;
    purchase.rawResponse = data;
    purchase.processed = true;

    switch (data.transactionStatus) {
      case 'Approved':
        purchase.status = PurchaseStatus.APPROVED;
        break;
      case 'Declined':
        purchase.status = PurchaseStatus.DECLINED;
        break;
      default:
        purchase.status = PurchaseStatus.PROCESSING;
    }

    await purchase.save();

    await this.processBusinessLogic(purchase);

    return this.successResponse(data.orderReference);
  }

  private generateSignature(data: any): string {
    const str = [
      this.merchantAccount,
      this.serviceUrl,
      data.orderReference,
      data.orderDate,
      data.amount,
      data.currency,
      data.productName,
      data.productId,
      data.productPrice,
      data.productType,
    ].join(';');

    return crypto
      .createHmac('sha1', this.merchantSecretKey)
      .update(str)
      .digest('hex');
  }

  private generateCallbackSignature(data: any): string {
    const str = [
      data.merchantAccount,
      data.orderReference,
      data.amount,
      data.currency,
      data.authCode,
      data.cardPan,
      data.transactionStatus,
      data.reasonCode,
    ].join(';');

    return crypto
      .createHmac('sha1', this.merchantSecretKey)
      .update(str)
      .digest('hex');
  }

  private successResponse(orderReference: string) {
    return {
      orderReference,
      status: 'accept',
      time: Date.now(),
    };
  }

  private async processBusinessLogic(purchase: PurchaseDocument) {
    if (purchase.status === PurchaseStatus.APPROVED) {
      const existingUser = await this.userModel.findOne({
        email: purchase.clientEmail,
      });
      if (existingUser) {
        await this.productPurchaseModel.create({
          userId: existingUser._id,
          productId: purchase.productId,
          targetModule: purchase.productType,
        });

        // send email notification about successful purchase
      } else if (purchase.clientEmail) {
        //send to emeil
      }
    }
  }

  private async checkExistingUser(dto: any) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists. Please log in to purchase this product.',
      );
    }
  }
}
