import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class TestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
