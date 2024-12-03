import { Inject, Injectable } from '@nestjs/common';
import { PersonService } from './person/person.service';

@Injectable()
export class AppService {
  // 构造器注入
  constructor(private personService: PersonService,
    @Inject('person2') private readonly person2:{name:string,desc:string}
  ) {}
  // 属性注入
  // @Inject(PersonService)
  // private personService:PersonService
  getHello(): string {
    // console.log(this.person2);
    return `Hello World!${this.personService.findAll()}`;
  }
}
