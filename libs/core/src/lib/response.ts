class Response {
  status: string;
  data: any;
  code: number;
  static TYPES = {
    ERROR: 'error',
    SUCCESS: 'success',
  };
  constructor(data: any = { }, status?: string) {
    this.status = status || Response.TYPES.SUCCESS;
    this.data = data;
    this.code = data.code || (this.status === Response.TYPES.ERROR ? 500 : 200);
  }
  json() {
    const dataProp =
      this.status === Response.TYPES.ERROR ? Response.TYPES.ERROR : 'data';
    return {
      status: this.status,
      statusCode: this.code,
      [dataProp]: this.data,
    };
  }
  success() {
    this.status = Response.TYPES.SUCCESS;
    this.code = this.data.code || this.code || 200;
    return this.json();
  }
  error() {
    this.status = Response.TYPES.ERROR;
    this.code = this.data.code || this.code || 500;
    this.data.error = true;
    return this.json();
  }
}

export default Response;
