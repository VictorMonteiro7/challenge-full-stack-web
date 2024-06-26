const BASE_URL = process.env.BASE_API_URL || 'http://localhost:5000';
type ApiReturn = {
  [key: string]: any;
};

type Headers = {
  [key: string]: string;
}

const getAndSetAuth = () => {
  const tokenExists = localStorage.getItem('tkn_teste_isa');
  return tokenExists;
}

class Api {
  controller: AbortController = new AbortController();
  async get(endpoint: string): Promise<ApiReturn> {
    try {
      let res;
      const token = getAndSetAuth();
      if (token) {
        res = await fetch(`${BASE_URL}${endpoint}`, {
          signal: this.controller.signal,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await fetch(`${BASE_URL}${endpoint}`);
      }
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async post(
    endpoint: string,
    body: ApiReturn,
  ): Promise<ApiReturn> {
    try {
      const token = getAndSetAuth();
      const headers: Headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: this.controller.signal,
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async put(
    endpoint: string,
    body: ApiReturn,
  ): Promise<ApiReturn> {
    try {
      const token = getAndSetAuth();
      const headers: Headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: this.controller.signal,
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.error || json.errors) {
        throw new Error(json.error);
      }
      return json;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async delete(
    endpoint: string,
  ): Promise<ApiReturn> {
    try {
      const token = getAndSetAuth();
      const headers: Headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: this.controller.signal,
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
};

Object.freeze(Api.prototype);

export { Api };
