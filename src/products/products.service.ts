import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

const cloudStorage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private productRepository:Repository<Product>){}


     findAll(){
        return this.productRepository.find()
    }
    findByCategory(id_category:number){
        return  this.productRepository.findBy({id_category:id_category})
    }

async create(files:Array<Express.Multer.File>, product:CreateProductDto)    {
    if(files.length === 0 ){
        throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
    }

    let uploadedFiles = 0 ; 

    const newProduct = this.productRepository.create(product)
    const savedProduct = await this.productRepository.save(newProduct)

    const startForEach = async()=>{
        await asyncForEach (files,async(file:Express.Multer.File)=>{
            const url = await cloudStorage(file , file.originalname)

            if(url !== undefined && url !== null){
                if(uploadedFiles === 0){
                    savedProduct.image1 = url
                }
                else if (uploadedFiles === 1){
                    savedProduct.image2 = url
                }
            }
            await this.update(savedProduct.id , savedProduct)
            uploadedFiles = uploadedFiles + 1

            
        })

    }
    await startForEach()
    return savedProduct
}
async updateWithImages(files:Array<Express.Multer.File>, id:number ,product:UpdateProductDto)    {
    if(files.length === 0 ){
        throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
    }

    let counter = 0
    let uploadedFiles = Number(product.images_to_update[counter]) ; 


  const updateProduct= await this.update(id,product)

    const startForEach = async()=>{
        await asyncForEach (files,async(file:Express.Multer.File)=>{
            const url = await cloudStorage(file , file.originalname)

            if(url !== undefined && url !== null){
                if(uploadedFiles === 0){
                    updateProduct.image1 = url
                }
                else if (uploadedFiles === 1){
                    updateProduct.image2 = url
                }
            }
            await this.update(updateProduct.id , updateProduct)
            counter++
            uploadedFiles = Number(product.images_to_update[counter])

            
        })

    }
    await startForEach()
    return updateProduct
}

async update(id:number,product:UpdateProductDto){
    const productFound = await this.productRepository.findOneBy({id:id})

    if(!productFound){
        throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND)
    }

    const updateProduct = Object.assign(productFound, product)
    return this.productRepository.save(updateProduct)
}
async delete(id:number){
    const productFound = await this.productRepository.findOneBy({id:id})

    if(!productFound){
        throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND)
    }

    
    return this.productRepository.delete(id)
}



}
