import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }
    getOne(id: number): Movie {
        // 우리가 데베에 정의한 id 값은 number임
        // return this.movies.find(
        //     (movie) => {
        //         movie.id == parseInt(id);
        //     }
        // )
        const movie = this.movies.find(movie => movie.id === id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID(${id}): notfound`);
        }
        return movie;
    }
    deleteOne(id: number): boolean {
        this.getOne(id)
        this.movies = this.movies.filter(movie => movie.id !== id)
        return true;
    }
    create(movieData: CreateMovieDto) {
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData,
        })
    }
    update(id: number, updateData: UpdateMovieDto) {
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.movies.push({ ...movie, ...updateData });
    }
}
