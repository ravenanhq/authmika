import {
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthClients } from 'src/db/model/auth-clients.model';

@Injectable()
export class AuthClientsService {
  constructor(
    @InjectModel(AuthClients)
    private clientDetailsModel: typeof AuthClients,
  ) {}

  async saveClientDetails(
    clientSecretId: string,
    clientSecretKey: string,
    redirectUrl: string,
  ) {
    try {
      const clientModel = await this.clientDetailsModel.findOne({
        where: { clientSecretKey: clientSecretKey },
      });
      if (!clientModel) {
        const newClient = await this.clientDetailsModel.create({
          clientSecretId,
          clientSecretKey,
          redirectUrl,
        });
        if (newClient) {
          return {
            message: 'Client details added.',
            statusCode: HttpStatus.OK,
            clientId: newClient.id,
          };
        }
      }
      {
        const client = await this.clientDetailsModel.update(
          { redirectUrl: redirectUrl },
          { where: { clientSecretKey } },
        );

        return {
          message: 'Client details added.',
          statusCode: HttpStatus.OK,
          clientId: clientModel.id,
        };
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(
          (err: { path: any; message: any }) => ({
            field: err.path,
            message: err.message,
          }),
        );
        throw new HttpException(
          { message: 'Validation faileds', errors: validationErrors },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }
}
