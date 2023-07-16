
import { ProductsService } from './products.service';import {
    Body,
    Controller,
   
    Delete,
   
    FileTypeValidator,
   
    Get,
   
    MaxFileSizeValidator,
  
    Param,
  
    ParseFilePipe,
  
    ParseIntPipe,
  
    Post,
  
    Put,
  
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { HasRoles } from 'src/auth/jwt/has-roles';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { JwtRole } from 'src/auth/jwt/jwt-role';
  import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
  import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
    constructor(private productsService:ProductsService){}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
      return this.productsService.findAll();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get("category/:id_category")
    findAllByCategory( @Param("id_category", ParseIntPipe) id_category:number) {
      return this.productsService.findByCategory(id_category);
    }


    @HasRoles(JwtRole.ADMIN,JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('files[]',2))
    create(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          ],
        }),
      )
      files: Array<Express.Multer.File>,
      @Body() product : CreateProductDto,
    ) {
      return this.productsService.create(files,product);
    }


    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put("upload/:id")
    @UseInterceptors(FilesInterceptor('files[]',2))
    updateWithImages(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          ],
        }),
      )
      files: Array<Express.Multer.File>,
      @Param("id",ParseIntPipe)id:number,
      @Body() product :UpdateProductDto,
    ) {
      return this.productsService.updateWithImages(files,id ,product);
    }


    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(":id")
    update(  
      @Param("id",ParseIntPipe)id:number,
      @Body() product :UpdateProductDto,
    ) {
      return this.productsService.update(id ,product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(":id")
    delete(  
      @Param("id",ParseIntPipe)id:number,
      
    ) {
      return this.productsService.delete(id);
    }
}
