import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();
        if(rpcError.toString().includes('Empty response')) return response.status(500).json({
            code: 500,
            time: new Date().toISOString(),
            path: `${response.req.method} ${response.req.url}`,
            data:  rpcError.toString() ?? 'Empty response',
        })
        if(typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError){
            const status = isNaN(+rpcError.status) ? 500 : +rpcError.status;
            return response.status(status).json({
                code: status,
                time: new Date().toISOString(),
                path: `${response.req.method} ${response.req.url}`,
                data: rpcError.message,
            });
        }
        
        response(500).json({
            code: 500,
            time: new Date().toISOString(),
            path: `${response.req.method} ${response.req.url}`,
            data: rpcError,
        })
    }
}