import { Injectable } from '@nestjs/common';
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
      console.log(error);
    }
  }

  async getContract() {
    try {
    } catch (error) {}
  }
  async updateContract(data: any) {
    const [id, ...contract] = data;
    try {
      await this.contractModel.findByIdAndUpdate(id, contract, {
        new: true, // Return the updated document
        runValidators: true, // Run validation checks
      });
    } catch (error) {}
  }
  async deleteContract(data: any) {
    try {
      await this.contractModel.deleteMany({
        _id: { $in: data },
      });
    } catch (error) {}
  }
}
