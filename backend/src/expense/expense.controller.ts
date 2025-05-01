import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';

@Controller('expense')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) {}

    @Post()
    create(@Body() expense: Partial<Expense>) {
        return this.expenseService.create(expense);
    }

    @Get()
    findAll() {
        return this.expenseService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.expenseService.findOne(id);
    }
    
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() expense: Partial<Expense>) {
        return this.expenseService.update(id, expense);
    }
    
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.expenseService.remove(id);
    }
}
