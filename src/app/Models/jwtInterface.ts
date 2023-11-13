import { JwtPayload } from 'jwt-decode';
export default interface JwtCustomInterface extends JwtPayload{
    groups: number[];
    user_id: number;
    permissions: number[];
    name: string;
}