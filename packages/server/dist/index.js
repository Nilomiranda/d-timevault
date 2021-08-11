"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const app = new koa_1.default();
dotenv_1.default.config();
app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`);
});
app.use(koa_bodyparser_1.default());
app.use(routes_1.default.routes());
//# sourceMappingURL=index.js.map