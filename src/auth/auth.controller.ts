import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

// Example response DTOs (replace with your actual response DTOs if available)
class RegisterResponse {
  id: string;
  email: string;
  username: string;
}

class LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@ApiTags('auth')
@ApiExtraModels(RegisterDto, LoginDto, RegisterResponse, LoginResponse)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials.',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Register Example',
        value: {
          email: 'user@example.com',
          username: 'newuser',
          password: 'StrongPassword123!',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(RegisterResponse) },
      ],
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        username: 'newuser',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be longer than 8 characters'],
        error: 'Bad Request',
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Authenticates a user and returns access and refresh tokens.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Login Example',
        value: {
          email: 'user@example.com',
          password: 'StrongPassword123!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(LoginResponse) },
      ],
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
