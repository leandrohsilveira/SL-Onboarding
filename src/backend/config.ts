import { BackendConfigArgs } from 'web-backend-api';
import { environment } from 'environments/environment';

const { schema, host, port } = environment.backend;

export const backendConfig: BackendConfigArgs = {
  strategyId: 'uuid',
  host: `${schema}://${host}:${port}`,
  apiBase: '',
  passThruUnknownUrl: true,
};
