export class QueryStringBuilder {
  private queryString: string;

  constructor() {
    this.queryString = '';
  }

  add(name: string, value: any): QueryStringBuilder {
    if (this.queryString.length > 0) {
      this.queryString += '&';
    }
    this.queryString += `${name}=${encodeURIComponent(value)}`;
    return this;
  }

  addIfNotNull(name: string, value?: any): QueryStringBuilder {
    if (value) {
      if (this.queryString.length > 0) {
        this.queryString += '&';
      }
      this.queryString += `${name}=${encodeURIComponent(value)}`;
    }
    return this;
  }

  addArray(name: string, values?: any[]): QueryStringBuilder {
    if (values && values.length > 0) {
      if (this.queryString.length > 0) {
        this.queryString += '&';
      }
      values.forEach((value, index) => {
        if (index > 0) {
          this.queryString += '&';
        }
        this.queryString += `${name}[]=${encodeURIComponent(value)}`;
      });
    }
    return this;
  }

  build = () => `${this.queryString.length > 0 ? '?' : ''}${this.queryString}`;
}
