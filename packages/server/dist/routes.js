"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default({
    prefix: "/api"
});
router.get("/status", (context) => {
    context.status = 200;
    return context.response.body = {
        online: true
    };
});
exports.default = router;
//# sourceMappingURL=routes.js.map