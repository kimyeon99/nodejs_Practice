import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get()
    home() {
        return 'welcom my nest app!'
    }
}
