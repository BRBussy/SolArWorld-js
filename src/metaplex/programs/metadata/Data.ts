import Creator from "./Creator";

export default class Data {
    public name: string = '';
    public symbol: string = '';
    public uri: string = '';
    public sellerFeeBasisPoints: number = 0;
    public creators: Creator[] | null = null;
}