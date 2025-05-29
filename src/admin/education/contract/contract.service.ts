import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
  ) {}

  async createContract(data: any) {
    try {
      const newContract = new this.contractModel(data);
      await newContract.save();
      return { id: newContract._id };
    } catch (error) {
      throw new BadRequestException('Помилка створення контракту :(');
    }
  }

  async getContract() {
    try {
    } catch (error) {}
  }
  async updateContract(data: any) {
    const { id, contract } = data;
    try {
      return await this.contractModel.findByIdAndUpdate(id, contract, {
        new: true, // Return the updated document
        runValidators: true, // Run validation checks
      });
    } catch (error) {
      throw new BadRequestException('Помилка оновлення контракту :(');
    }
  }
  async deleteContract(data: any) {
    const contractIds = data.map((data) => data.contract.toHexString());
    try {
      await this.contractModel.deleteMany({
        _id: { $in: contractIds },
      });
    } catch (error) {
      throw new BadRequestException('Не  вдалося видалити контракти');
    }
  }
}
