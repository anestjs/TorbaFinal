import { Body, Controller, Get, Post, Req, UseGuards ,Res, HttpException, HttpStatus, Render} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService){

    }

    // @Post('login')
    // @UseGuards(LocalGuard)
    // login(@Body() authPayload:AuthPayloadDto) {
    //     const user = this.authService.validateUser(authPayload);
    //     // if (!user) throw new HttpException('Invalid Cridentials',401);
    //     return user;
    // }


    // @Post('login')
    // @UseGuards(LocalGuard)
    // login(@Req() req:Request,@Res() res: Response) {
      
    //     return req.user; 
    // }

    @Post('login')
  @UseGuards(LocalGuard) // Guard to validate user credentials
  async login(
    @Body('username') email: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req:Request,
  ) {
    if (!email || !password) {
      throw new HttpException('email and password are required', HttpStatus.BAD_REQUEST);
    }

    // Simulate extracting JWT token (from a service or user object)
    const token = req.user;
    // Replace with real token generation logic

    console.log(token);
    
    // Set the token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect the user after successful login
    return res.redirect(`/auth/status-proxy`);
  }

  @Get('dashboard')
  @Render('dashboard') // Render the 'lands' HBS view
  async getLandsPage() {
   
  }



  @Get('status-proxy')
  async statusProxy(@Req() req: Request, @Res() res: Response) {
    try {
      // Get the JWT token from the cookie
      const token = req.cookies['jwt']; // Assuming the cookie name is 'jwt'

      if (!token) {
        return res.status(401).json({ message: 'Token is missing from the cookie' });
      }

      // Send the token as a Bearer token to the /auth/status route
      const response = await axios.get('http://localhost:3000/auth/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Send the response back to the client
      return res.json(response.data);
    } catch (error) {
      console.error('Error in status proxy:', error);
      return res.status(500).json({ message: 'An error occurred while fetching the status' });
    }
  }


    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req:Request) 
    {
            // console.log('Inside authcontroller status method');
            // console.log(req.user)
            return "I CAN GIVE U WHATEEVR U WANT";
            
    }
}

// loooooooooooooooooooooooooooooooooooooooooooooook heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>{{title}}</title>
// </head>
// <body>
//   <h1>{{title}}</h1>
//   <ul id="product-list">
//     {{#each products}}
//       <li>{{this}}</li>
//     {{/each}}
//   </ul>

//   <!-- Client-side JavaScript -->
//   <script>
//     // Using Axios to fetch additional data from an API
//     axios.get('/api/products')
//       .then(response => {
//         const productList = document.getElementById('product-list');
//         response.data.products.forEach(product => {
//           const listItem = document.createElement('li');
//           listItem.textContent = product;
//           productList.appendChild(listItem);
//         });
//       })
//       .catch(error => console.error('Error fetching additional products:', error));
//   </script>

//   <!-- Include Axios (use a CDN or local file) -->
//   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// </body>
// </html>

