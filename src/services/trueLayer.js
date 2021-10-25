"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../config"));
const base_1 = __importDefault(require("./base"));
const authenticateProvider = (event) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, base_1.default)((sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        const { code } = event.queryStringParameters;
        console.log('OAuth code received from UI: ', code);
        const { trueLayer: { apiUrl, clientId, clientSecret, redirectUrl }, } = config_1.default;
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('redirect_uri', redirectUrl);
        params.append('code', code);
        console.log('URL encoded params for TrueLayer: ', params);
        const response = yield (0, node_fetch_1.default)(`${apiUrl}/connect/token`, {
            method: 'POST',
            body: params,
        });
        const data = yield response.json();
        console.log('Data received from request: ', data);
        const { Token, UserProvider } = sequelize.models;
        const token = yield Token.create({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiry: data.expiry_time,
            scope: data.scope,
        });
        yield UserProvider.create({
            userId: 1,
            providerId: 1,
            tokenId: token.id,
        });
        return {
            statusCode: response.status,
        };
    }));
});
exports.authenticateProvider = authenticateProvider;
