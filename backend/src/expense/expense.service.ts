import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';

@Injectable()
export class ExpenseService {
    constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create (expense: Partial<Expense>) {
    if (expense.date) {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (expenseDate > today) {
        throw new BadRequestException('Não é permitido cadastrar despesas com datas futuras');
      }
    } else {
      throw new BadRequestException('A data da despesa é obrigatória');
    }
    
    console.log('Salvando despesa no banco de dados:', expense);
    
    try {
      const savedExpense = await this.expenseRepository.save(expense);
      console.log('Despesa salva com sucesso:', savedExpense);
      return savedExpense;
    } catch (error) {
      console.error('Erro ao salvar despesa no banco de dados:', error);
      throw error;
    }
  }

  async findAll () {
    console.log('Buscando todas as despesas do banco de dados');
    try {
      const expenses = await this.expenseRepository.find({
          order: { date: 'DESC' },
      });
      console.log(`Encontradas ${expenses.length} despesas no banco de dados`);
      return expenses;
    } catch (error) {
      console.error('Erro ao buscar despesas do banco de dados:', error);
      throw error;
    }
  }
  
  async findOne(id: number) {
    console.log(`Buscando despesa com ID ${id}`);
    try {
      const expense = await this.expenseRepository.findOne({ where: { id } });
      if (!expense) {
        throw new BadRequestException(`Despesa com ID ${id} não encontrada`);
      }
      return expense;
    } catch (error) {
      console.error(`Erro ao buscar despesa com ID ${id}:`, error);
      throw error;
    }
  }
  
  async update(id: number, expense: Partial<Expense>) {
    console.log(`Atualizando despesa com ID ${id}:`, expense);
    
    if (expense.date) {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (expenseDate > today) {
        throw new BadRequestException('Não é permitido cadastrar despesas com datas futuras');
      }
    }
    
    try {
      await this.findOne(id);
      
      await this.expenseRepository.update(id, expense);
      
      const updatedExpense = await this.findOne(id);
      console.log('Despesa atualizada com sucesso:', updatedExpense);
      return updatedExpense;
    } catch (error) {
      console.error(`Erro ao atualizar despesa com ID ${id}:`, error);
      throw error;
    }
  }
  
  async remove(id: number) {
    console.log(`Removendo despesa com ID ${id}`);
    try {
      await this.findOne(id);
      
      await this.expenseRepository.delete(id);
      console.log(`Despesa com ID ${id} removida com sucesso`);
      return { success: true, message: `Despesa com ID ${id} removida com sucesso` };
    } catch (error) {
      console.error(`Erro ao remover despesa com ID ${id}:`, error);
      throw error;
    }
  }
}
