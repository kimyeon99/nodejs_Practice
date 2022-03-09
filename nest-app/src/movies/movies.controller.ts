import { Controller, Delete, Get, Post, Param, Patch } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
    @Get()
    getAll() {
        return "This reall all movies";
    }

    @Get("/:id")
    getOne(@Param('id') id: string) {
        return `This return one movies!! ${id}`;
    }

    @Post()
    create() {
        return 'create movie';
    }

    @Delete('/:id')
    remove(@Param('id') movieId: string) {
        return `remove ${movieId} movie`;
    }

    @Patch('/:id')
    patch(@Param('id') movieId: string) {
        return `patch ${movieId}`
    }


}   