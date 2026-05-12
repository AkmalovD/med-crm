import {Injectable} from "@nestjs/common";

type Clients = {
    id: string
    email: string
    fullName: string
    address: string
    number: string
    organization: string
    createdAt: string
    updatedAt: string
}

@Injectable()
export class ClientsService {

}