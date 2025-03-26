import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface ApiRequestOptions {
  url: string;
  method: string;
  body?: FormData | unknown;
  headers?: Record<string, string>;
}

export async function apiRequest(
  options: ApiRequestOptions
): Promise<any>;

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response>;

export async function apiRequest(
  optionsOrMethod: ApiRequestOptions | string,
  url?: string,
  data?: unknown | undefined,
): Promise<any> {
  let method: string;
  let endpoint: string;
  let body: any;
  let headers: Record<string, string> = {};

  if (typeof optionsOrMethod === 'string') {
    // Old method signature: apiRequest(method, url, data)
    method = optionsOrMethod;
    endpoint = url!;
    body = data;
    if (data && !(data instanceof FormData)) {
      headers = { "Content-Type": "application/json" };
      body = JSON.stringify(data);
    }
  } else {
    // New method signature: apiRequest(options)
    method = optionsOrMethod.method;
    endpoint = optionsOrMethod.url;
    
    if (optionsOrMethod.headers) {
      headers = optionsOrMethod.headers;
    }
    
    if (optionsOrMethod.body instanceof FormData) {
      body = optionsOrMethod.body;
    } else if (optionsOrMethod.body) {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      body = JSON.stringify(optionsOrMethod.body);
    }
  }

  const res = await fetch(endpoint, {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  try {
    // Try to parse as JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return res;
  } catch (error) {
    return res;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
