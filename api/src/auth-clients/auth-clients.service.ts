import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthClients } from 'src/db/model/auth-clients.model';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthClientsService {
  private clientDetails: any;

  constructor(
    @InjectModel(AuthClients)
    private clientDetailsModel: typeof AuthClients,
  ) {}

  async saveClientDetails(key: string) {
    try {
      this.clientDetails = jwt.verify(key, 'authmika');
      const clientSecretId = this.clientDetails.clientSecretId;
      const clientSecretKey = this.clientDetails.clientSecretKey;
      const redirectUrl = this.clientDetails.redirectUrl;

      if (this.clientDetails) {
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
        } else {
          await this.clientDetailsModel.update(
            { redirectUrl: redirectUrl },
            { where: { clientSecretKey } },
          );

          return {
            message: 'Client details added.',
            statusCode: HttpStatus.OK,
            clientId: clientModel.id,
            redirectUrl: redirectUrl,
          };
        }
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
