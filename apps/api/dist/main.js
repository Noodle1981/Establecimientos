/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_module_1 = __webpack_require__(/*! ./prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const edificios_module_1 = __webpack_require__(/*! ./modules/edificios/edificios.module */ "./src/modules/edificios/edificios.module.ts");
const establecimientos_module_1 = __webpack_require__(/*! ./modules/establecimientos/establecimientos.module */ "./src/modules/establecimientos/establecimientos.module.ts");
const modalidades_module_1 = __webpack_require__(/*! ./modules/modalidades/modalidades.module */ "./src/modules/modalidades/modalidades.module.ts");
const validaciones_module_1 = __webpack_require__(/*! ./modules/validaciones/validaciones.module */ "./src/modules/validaciones/validaciones.module.ts");
const logs_module_1 = __webpack_require__(/*! ./modules/logs/logs.module */ "./src/modules/logs/logs.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            edificios_module_1.EdificiosModule,
            establecimientos_module_1.EstablecimientosModule,
            modalidades_module_1.ModalidadesModule,
            validaciones_module_1.ValidacionesModule,
            logs_module_1.LogsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        return this.authService.login(body);
    }
    getProfile(req) {
        return req.user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'sue-secret-jwt-key-change-in-prod',
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(pass, user.password);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales de acceso inválidas.');
        }
        const payload = { email: user.email, sub: Number(user.id), role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: Number(user.id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/decorators/roles.decorator.ts":
/*!********************************************************!*\
  !*** ./src/modules/auth/decorators/roles.decorator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/modules/auth/guards/roles.guard.ts":
/*!************************************************!*\
  !*** ./src/modules/auth/guards/roles.guard.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ../decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return user && requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const users_service_1 = __webpack_require__(/*! ../../users/users.service */ "./src/modules/users/users.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'sue-secret-jwt-key-change-in-prod',
        });
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.findOneById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('Acceso no autorizado.');
        }
        return {
            id: Number(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/modules/edificios/edificios.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/edificios/edificios.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EdificiosController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const edificios_service_1 = __webpack_require__(/*! ./edificios.service */ "./src/modules/edificios/edificios.service.ts");
let EdificiosController = class EdificiosController {
    constructor(edificiosService) {
        this.edificiosService = edificiosService;
    }
    async findAll() {
        return this.edificiosService.findAll();
    }
    async findOneByCui(cui) {
        return this.edificiosService.findOneByCui(cui);
    }
};
exports.EdificiosController = EdificiosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EdificiosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':cui'),
    __param(0, (0, common_1.Param)('cui')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EdificiosController.prototype, "findOneByCui", null);
exports.EdificiosController = EdificiosController = __decorate([
    (0, common_1.Controller)('edificios'),
    __metadata("design:paramtypes", [typeof (_a = typeof edificios_service_1.EdificiosService !== "undefined" && edificios_service_1.EdificiosService) === "function" ? _a : Object])
], EdificiosController);


/***/ }),

/***/ "./src/modules/edificios/edificios.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/edificios/edificios.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EdificiosModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const edificios_service_1 = __webpack_require__(/*! ./edificios.service */ "./src/modules/edificios/edificios.service.ts");
const edificios_controller_1 = __webpack_require__(/*! ./edificios.controller */ "./src/modules/edificios/edificios.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let EdificiosModule = class EdificiosModule {
};
exports.EdificiosModule = EdificiosModule;
exports.EdificiosModule = EdificiosModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [edificios_controller_1.EdificiosController],
        providers: [edificios_service_1.EdificiosService],
        exports: [edificios_service_1.EdificiosService],
    })
], EdificiosModule);


/***/ }),

/***/ "./src/modules/edificios/edificios.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/edificios/edificios.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EdificiosService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let EdificiosService = class EdificiosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.edificio.findMany({
            where: { deleted_at: null },
            include: {
                establecimientos: {
                    include: {
                        modalidades: true,
                    },
                },
            },
        });
    }
    async findOneByCui(cui) {
        const edificio = await this.prisma.edificio.findUnique({
            where: { cui },
            include: {
                establecimientos: {
                    include: {
                        modalidades: true,
                    },
                },
            },
        });
        if (!edificio) {
            throw new common_1.NotFoundException(`Edificio con CUI ${cui} no encontrado.`);
        }
        return edificio;
    }
};
exports.EdificiosService = EdificiosService;
exports.EdificiosService = EdificiosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], EdificiosService);


/***/ }),

/***/ "./src/modules/establecimientos/establecimientos.controller.ts":
/*!*********************************************************************!*\
  !*** ./src/modules/establecimientos/establecimientos.controller.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstablecimientosController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const establecimientos_service_1 = __webpack_require__(/*! ./establecimientos.service */ "./src/modules/establecimientos/establecimientos.service.ts");
let EstablecimientosController = class EstablecimientosController {
    constructor(establecimientosService) {
        this.establecimientosService = establecimientosService;
    }
    async findOneByCue(cue) {
        return this.establecimientosService.findOneByCue(cue);
    }
};
exports.EstablecimientosController = EstablecimientosController;
__decorate([
    (0, common_1.Get)(':cue'),
    __param(0, (0, common_1.Param)('cue', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EstablecimientosController.prototype, "findOneByCue", null);
exports.EstablecimientosController = EstablecimientosController = __decorate([
    (0, common_1.Controller)('establecimientos'),
    __metadata("design:paramtypes", [typeof (_a = typeof establecimientos_service_1.EstablecimientosService !== "undefined" && establecimientos_service_1.EstablecimientosService) === "function" ? _a : Object])
], EstablecimientosController);


/***/ }),

/***/ "./src/modules/establecimientos/establecimientos.module.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/establecimientos/establecimientos.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstablecimientosModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const establecimientos_service_1 = __webpack_require__(/*! ./establecimientos.service */ "./src/modules/establecimientos/establecimientos.service.ts");
const establecimientos_controller_1 = __webpack_require__(/*! ./establecimientos.controller */ "./src/modules/establecimientos/establecimientos.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let EstablecimientosModule = class EstablecimientosModule {
};
exports.EstablecimientosModule = EstablecimientosModule;
exports.EstablecimientosModule = EstablecimientosModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [establecimientos_controller_1.EstablecimientosController],
        providers: [establecimientos_service_1.EstablecimientosService],
        exports: [establecimientos_service_1.EstablecimientosService],
    })
], EstablecimientosModule);


/***/ }),

/***/ "./src/modules/establecimientos/establecimientos.service.ts":
/*!******************************************************************!*\
  !*** ./src/modules/establecimientos/establecimientos.service.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstablecimientosService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let EstablecimientosService = class EstablecimientosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByCue(cue) {
        const establecimiento = await this.prisma.establecimiento.findUnique({
            where: { cue: BigInt(cue) },
            include: {
                edificio: true,
                modalidades: true,
            },
        });
        if (!establecimiento) {
            throw new common_1.NotFoundException(`Establecimiento con CUE ${cue} no encontrado.`);
        }
        return establecimiento;
    }
};
exports.EstablecimientosService = EstablecimientosService;
exports.EstablecimientosService = EstablecimientosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], EstablecimientosService);


/***/ }),

/***/ "./src/modules/logs/logs.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/logs/logs.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const logs_service_1 = __webpack_require__(/*! ./logs.service */ "./src/modules/logs/logs.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
let LogsController = class LogsController {
    constructor(logsService) {
        this.logsService = logsService;
    }
    async findAll() {
        return this.logsService.findAll();
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findAll", null);
exports.LogsController = LogsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('logs'),
    __metadata("design:paramtypes", [typeof (_a = typeof logs_service_1.LogsService !== "undefined" && logs_service_1.LogsService) === "function" ? _a : Object])
], LogsController);


/***/ }),

/***/ "./src/modules/logs/logs.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/logs/logs.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const logs_service_1 = __webpack_require__(/*! ./logs.service */ "./src/modules/logs/logs.service.ts");
const logs_controller_1 = __webpack_require__(/*! ./logs.controller */ "./src/modules/logs/logs.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let LogsModule = class LogsModule {
};
exports.LogsModule = LogsModule;
exports.LogsModule = LogsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [logs_controller_1.LogsController],
        providers: [logs_service_1.LogsService],
        exports: [logs_service_1.LogsService],
    })
], LogsModule);


/***/ }),

/***/ "./src/modules/logs/logs.service.ts":
/*!******************************************!*\
  !*** ./src/modules/logs/logs.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let LogsService = class LogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            take: 100,
        });
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], LogsService);


/***/ }),

/***/ "./src/modules/modalidades/modalidades.controller.ts":
/*!***********************************************************!*\
  !*** ./src/modules/modalidades/modalidades.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModalidadesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const modalidades_service_1 = __webpack_require__(/*! ./modalidades.service */ "./src/modules/modalidades/modalidades.service.ts");
let ModalidadesController = class ModalidadesController {
    constructor(service) {
        this.service = service;
    }
    async findAll(query) {
        const skip = query.skip ? parseInt(query.skip, 10) : 0;
        const take = query.take ? parseInt(query.take, 10) : 20;
        const sectorFilter = query.sectorFilter ? parseInt(query.sectorFilter, 10) : undefined;
        const conObservacionesFilter = query.conObservacionesFilter === 'true';
        const showDeleted = query.showDeleted === 'true';
        return this.service.findAll({
            skip,
            take,
            search: query.search,
            nivelFilter: query.nivelFilter,
            ambitoFilter: query.ambitoFilter,
            radioFilter: query.radioFilter,
            categoriaFilter: query.categoriaFilter,
            zonaFilter: query.zonaFilter,
            sectorFilter,
            direccionAreaFilter: query.direccionAreaFilter,
            estadoFilter: query.estadoFilter,
            zonaLetraFilter: query.zonaLetraFilter,
            conObservacionesFilter,
            showDeleted,
        });
    }
    async exportExcel(res, query) {
        const sectorFilter = query.sectorFilter ? parseInt(query.sectorFilter, 10) : undefined;
        const conObservacionesFilter = query.conObservacionesFilter === 'true';
        const showDeleted = query.showDeleted === 'true';
        return this.service.exportExcel(res, {
            search: query.search,
            nivelFilter: query.nivelFilter,
            ambitoFilter: query.ambitoFilter,
            radioFilter: query.radioFilter,
            categoriaFilter: query.categoriaFilter,
            zonaFilter: query.zonaFilter,
            sectorFilter,
            direccionAreaFilter: query.direccionAreaFilter,
            estadoFilter: query.estadoFilter,
            zonaLetraFilter: query.zonaLetraFilter,
            conObservacionesFilter,
            showDeleted,
        });
    }
    async lookupEdificioByCui(cui) {
        return this.service.lookupEdificioByCui(cui);
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async create(dto) {
        return this.service.create(dto);
    }
    async softDelete(id) {
        return this.service.softDelete(id);
    }
    async restore(id) {
        return this.service.restore(id);
    }
};
exports.ModalidadesController = ModalidadesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)('lookup/edificio/:cui'),
    __param(0, (0, common_1.Param)('cui')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "lookupEdificioByCui", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Put)(':id/restore'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModalidadesController.prototype, "restore", null);
exports.ModalidadesController = ModalidadesController = __decorate([
    (0, common_1.Controller)('modalidades'),
    __metadata("design:paramtypes", [typeof (_a = typeof modalidades_service_1.ModalidadesService !== "undefined" && modalidades_service_1.ModalidadesService) === "function" ? _a : Object])
], ModalidadesController);


/***/ }),

/***/ "./src/modules/modalidades/modalidades.module.ts":
/*!*******************************************************!*\
  !*** ./src/modules/modalidades/modalidades.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModalidadesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const modalidades_controller_1 = __webpack_require__(/*! ./modalidades.controller */ "./src/modules/modalidades/modalidades.controller.ts");
const modalidades_service_1 = __webpack_require__(/*! ./modalidades.service */ "./src/modules/modalidades/modalidades.service.ts");
let ModalidadesModule = class ModalidadesModule {
};
exports.ModalidadesModule = ModalidadesModule;
exports.ModalidadesModule = ModalidadesModule = __decorate([
    (0, common_1.Module)({
        controllers: [modalidades_controller_1.ModalidadesController],
        providers: [modalidades_service_1.ModalidadesService],
        exports: [modalidades_service_1.ModalidadesService],
    })
], ModalidadesModule);


/***/ }),

/***/ "./src/modules/modalidades/modalidades.service.ts":
/*!********************************************************!*\
  !*** ./src/modules/modalidades/modalidades.service.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModalidadesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const database_1 = __webpack_require__(/*! @sue/database */ "@sue/database");
const ExcelJS = __webpack_require__(/*! exceljs */ "exceljs");
let ModalidadesService = class ModalidadesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { skip = 0, take = 20, search, nivelFilter, ambitoFilter, radioFilter, categoriaFilter, zonaFilter, sectorFilter, direccionAreaFilter, estadoFilter, zonaLetraFilter, conObservacionesFilter, showDeleted = false, } = params;
        const where = {};
        if (showDeleted) {
            where.deletedAt = { not: null };
        }
        else {
            where.deletedAt = null;
        }
        const establishmentConditions = [];
        if (search) {
            const orConditions = [
                { nombre: { contains: search, mode: 'insensitive' } },
                { edificio: { cui: { contains: search, mode: 'insensitive' } } },
            ];
            const numericCue = parseInt(search, 10);
            if (!isNaN(numericCue)) {
                orConditions.push({ cue: BigInt(numericCue) });
            }
            establishmentConditions.push({ OR: orConditions });
        }
        if (zonaFilter) {
            establishmentConditions.push({
                edificio: {
                    zonaDepartamento: { contains: zonaFilter.trim(), mode: 'insensitive' },
                },
            });
        }
        if (establishmentConditions.length > 0) {
            where.establecimiento = {
                AND: establishmentConditions,
            };
        }
        if (nivelFilter) {
            where.nivelEducativo = nivelFilter;
        }
        if (ambitoFilter) {
            where.ambito = ambitoFilter;
        }
        if (radioFilter) {
            where.radio = new database_1.Prisma.Decimal(radioFilter);
        }
        if (categoriaFilter) {
            where.categoria = { contains: categoriaFilter, mode: 'insensitive' };
        }
        if (sectorFilter !== undefined) {
            where.sector = sectorFilter;
        }
        if (direccionAreaFilter) {
            where.direccionArea = direccionAreaFilter;
        }
        if (estadoFilter) {
            if (estadoFilter === 'VALIDADO') {
                where.validado = true;
            }
            else if (estadoFilter === 'PENDIENTE') {
                where.validado = false;
            }
        }
        if (zonaLetraFilter) {
            where.zona = zonaLetraFilter.trim();
        }
        if (conObservacionesFilter) {
            where.observaciones = { not: '', mode: 'insensitive' };
        }
        const [total, data] = await Promise.all([
            this.prisma.modalidad.count({ where }),
            this.prisma.modalidad.findMany({
                where,
                skip,
                take,
                include: {
                    establecimiento: {
                        include: {
                            edificio: true,
                        },
                    },
                    usuarioValidacion: {
                        select: { id: true, name: true, email: true, role: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return { total, data, skip, take };
    }
    async findOne(id) {
        const modality = await this.prisma.modalidad.findFirst({
            where: { id: BigInt(id), deletedAt: null },
            include: {
                establecimiento: {
                    include: {
                        edificio: true,
                    },
                },
                usuarioValidacion: true,
                historialEstados: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!modality) {
            throw new common_1.NotFoundException(`Modalidad with ID ${id} not found.`);
        }
        return modality;
    }
    async lookupEdificioByCui(cui) {
        const edificio = await this.prisma.edificio.findUnique({
            where: { cui },
            include: {
                establecimientos: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!edificio) {
            throw new common_1.NotFoundException(`No building matches CUI ${cui}`);
        }
        const cabecera = edificio.establecimientos.find((e) => e.cue === e.cueEdificioPrincipal);
        return {
            edificio,
            cabeceraNombre: cabecera ? cabecera.nombre : null,
        };
    }
    async create(dto) {
        const { nombre_establecimiento, cue, cui, establecimiento_cabecera, nivel_educativo, direccion_area, sector, radio, zona, observaciones, categoria, ambito, zona_departamento, localidad, calle, numero_puerta, validado, latitud, longitud, } = dto;
        if (!/^\d{9}$|^PROV.*$/.test(cue)) {
            throw new common_1.BadRequestException('El CUE debe tener 9 dígitos o iniciar con "PROV"');
        }
        if (!/^\d{7}$|^PROV.*$/.test(cui)) {
            throw new common_1.BadRequestException('El CUI debe tener 7 dígitos o iniciar con "PROV"');
        }
        const parsedCue = BigInt(cue);
        return this.prisma.$transaction(async (tx) => {
            const edificio = await tx.edificio.upsert({
                where: { cui },
                create: {
                    cui,
                    calle: calle.toUpperCase(),
                    numeroPuerta: numero_puerta || 'S/N',
                    localidad: localidad.toUpperCase(),
                    zonaDepartamento: zona_departamento.toUpperCase(),
                    latitud: latitud ? new database_1.Prisma.Decimal(latitud) : 0,
                    longitud: longitud ? new database_1.Prisma.Decimal(longitud) : 0,
                },
                update: {},
            });
            const establecimiento = await tx.establecimiento.upsert({
                where: { cue: parsedCue },
                create: {
                    edificioId: edificio.id,
                    cue: parsedCue,
                    nombre: nombre_establecimiento.toUpperCase(),
                    establecimientoCabecera: establecimiento_cabecera ? establecimiento_cabecera.toUpperCase() : null,
                    cueEdificioPrincipal: parsedCue,
                },
                update: {},
            });
            return tx.modalidad.create({
                data: {
                    establecimientoId: establecimiento.id,
                    direccionArea: direccion_area,
                    nivelEducativo: nivel_educativo,
                    sector: sector ? parseInt(sector, 10) : 1,
                    radio: radio ? new database_1.Prisma.Decimal(radio) : null,
                    zona: zona ? zona.toUpperCase() : null,
                    categoria: categoria ? categoria.toUpperCase() : null,
                    ambito: (ambito || 'PUBLICO'),
                    validado: !!validado,
                    estadoValidacion: validado ? 'CORRECTO' : 'PENDIENTE',
                    observaciones: observaciones || null,
                },
            });
        });
    }
    async softDelete(id) {
        await this.findOne(id);
        return this.prisma.modalidad.update({
            where: { id: BigInt(id) },
            data: { deletedAt: new Date(), estadoValidacion: 'ELIMINADO' },
        });
    }
    async restore(id) {
        const modality = await this.prisma.modalidad.findUnique({ where: { id: BigInt(id) } });
        if (!modality || !modality.deletedAt) {
            throw new common_1.BadRequestException('Modalidad is not deleted or does not exist.');
        }
        return this.prisma.modalidad.update({
            where: { id: BigInt(id) },
            data: { deletedAt: null, estadoValidacion: 'PENDIENTE' },
        });
    }
    async exportExcel(res, queryParams) {
        const { data } = await this.findAll({ ...queryParams, take: 50000 });
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Establecimientos');
        sheet.columns = [
            { header: 'CUE', key: 'cue', width: 12 },
            { header: 'CUI', key: 'cui', width: 10 },
            { header: 'NOMBRE ESTABLECIMIENTO', key: 'nombre', width: 35 },
            { header: 'NIVEL', key: 'nivel', width: 20 },
            { header: 'DIRECCIÓN DE ÁREA', key: 'area', width: 25 },
            { header: 'SECTOR', key: 'sector', width: 10 },
            { header: 'ÁMBITO', key: 'ambito', width: 12 },
            { header: 'ZONA EDUC.', key: 'zona', width: 12 },
            { header: 'RADIO', key: 'radio', width: 10 },
            { header: 'CATEGORÍA', key: 'categoria', width: 15 },
            { header: 'DEPARTAMENTO', key: 'departamento', width: 20 },
            { header: 'LOCALIDAD', key: 'localidad', width: 20 },
            { header: 'CALLE', key: 'calle', width: 30 },
            { header: 'N°', key: 'numero', width: 8 },
            { header: 'ESTADO', key: 'estado', width: 15 },
            { header: 'OBSERVACIONES', key: 'observaciones', width: 30 },
        ];
        const headerRow = sheet.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FE8204' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 11,
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        data.forEach((item) => {
            const row = sheet.addRow({
                cue: item.establecimiento.cue,
                cui: item.establecimiento.edificio.cui,
                nombre: item.establecimiento.nombre,
                nivel: item.nivelEducativo,
                area: item.direccionArea,
                sector: item.sector === 1 ? 'ESTATAL' : 'PRIVADO',
                ambito: item.ambito,
                zona: item.zona || 'N/A',
                radio: item.radio || 'N/A',
                categoria: item.categoria || 'N/A',
                departamento: item.establecimiento.edificio.zonaDepartamento,
                localidad: item.establecimiento.edificio.localidad,
                calle: item.establecimiento.edificio.calle,
                numero: item.establecimiento.edificio.numeroPuerta,
                estado: item.validado ? 'VALIDADO' : 'PENDIENTE',
                observaciones: item.observaciones || '',
            });
            const stateCell = row.getCell('estado');
            if (item.validado) {
                stateCell.font = { color: { argb: '008000' }, bold: true };
            }
            else {
                stateCell.font = { color: { argb: 'FF0000' }, bold: true };
            }
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=establecimientos_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    }
};
exports.ModalidadesService = ModalidadesService;
exports.ModalidadesService = ModalidadesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ModalidadesService);


/***/ }),

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findOneById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(id) },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),

/***/ "./src/modules/validaciones/validaciones.controller.ts":
/*!*************************************************************!*\
  !*** ./src/modules/validaciones/validaciones.controller.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidacionesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const validaciones_service_1 = __webpack_require__(/*! ./validaciones.service */ "./src/modules/validaciones/validaciones.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
let ValidacionesController = class ValidacionesController {
    constructor(validacionesService) {
        this.validacionesService = validacionesService;
    }
    async validateModality(id, body, req) {
        return this.validacionesService.validateModality(id, body, req.user.id);
    }
};
exports.ValidacionesController = ValidacionesController;
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ValidacionesController.prototype, "validateModality", null);
exports.ValidacionesController = ValidacionesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'administrativos'),
    (0, common_1.Controller)('validaciones'),
    __metadata("design:paramtypes", [typeof (_a = typeof validaciones_service_1.ValidacionesService !== "undefined" && validaciones_service_1.ValidacionesService) === "function" ? _a : Object])
], ValidacionesController);


/***/ }),

/***/ "./src/modules/validaciones/validaciones.module.ts":
/*!*********************************************************!*\
  !*** ./src/modules/validaciones/validaciones.module.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidacionesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const validaciones_service_1 = __webpack_require__(/*! ./validaciones.service */ "./src/modules/validaciones/validaciones.service.ts");
const validaciones_controller_1 = __webpack_require__(/*! ./validaciones.controller */ "./src/modules/validaciones/validaciones.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let ValidacionesModule = class ValidacionesModule {
};
exports.ValidacionesModule = ValidacionesModule;
exports.ValidacionesModule = ValidacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [validaciones_controller_1.ValidacionesController],
        providers: [validaciones_service_1.ValidacionesService],
        exports: [validaciones_service_1.ValidacionesService],
    })
], ValidacionesModule);


/***/ }),

/***/ "./src/modules/validaciones/validaciones.service.ts":
/*!**********************************************************!*\
  !*** ./src/modules/validaciones/validaciones.service.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidacionesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let ValidacionesService = class ValidacionesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateModality(id, dto, auditorId) {
        const { estado, observaciones } = dto;
        const requiresComments = ['CORREGIDO', 'REVISAR', 'BAJA'].includes(estado);
        if (requiresComments && (!observaciones || observaciones.trim().length < 10)) {
            throw new common_1.BadRequestException('Las observaciones son estrictamente obligatorias (mínimo 10 caracteres) para el estado seleccionado.');
        }
        const modality = await this.prisma.modalidad.findUnique({
            where: { id: BigInt(id) },
        });
        if (!modality) {
            throw new common_1.NotFoundException(`Modalidad con ID ${id} no encontrada.`);
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.modalidad.update({
                where: { id: BigInt(id) },
                data: {
                    estadoValidacion: estado,
                    validado: ['CORRECTO', 'CORREGIDO'].includes(estado),
                    validadoPorUserId: BigInt(auditorId),
                    validadoEn: new Date(),
                    observaciones: observaciones || null,
                },
            });
            await tx.historialEstadoModalidad.create({
                data: {
                    modalidadId: BigInt(id),
                    userId: BigInt(auditorId),
                    estadoAnterior: modality.estadoValidacion,
                    estadoNuevo: estado,
                    observaciones: observaciones || null,
                },
            });
            await tx.activityLog.create({
                data: {
                    userId: BigInt(auditorId),
                    action: 'CAMBIO_ESTADO',
                    modelType: 'Modalidad',
                    modelId: BigInt(id),
                    description: `Modificó estado de validación de ID ${modality.id} a ${estado}`,
                    changes: { estadoAnterior: modality.estadoValidacion, estadoNuevo: estado },
                },
            });
            return updated;
        });
    }
};
exports.ValidacionesService = ValidacionesService;
exports.ValidacionesService = ValidacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ValidacionesService);


/***/ }),

/***/ "./src/prisma/prisma.module.ts":
/*!*************************************!*\
  !*** ./src/prisma/prisma.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/prisma/prisma.service.ts");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),

/***/ "./src/prisma/prisma.service.ts":
/*!**************************************!*\
  !*** ./src/prisma/prisma.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const database_1 = __webpack_require__(/*! @sue/database */ "@sue/database");
let PrismaService = class PrismaService extends database_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@sue/database":
/*!********************************!*\
  !*** external "@sue/database" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@sue/database");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "exceljs":
/*!**************************!*\
  !*** external "exceljs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("exceljs");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
BigInt.prototype.toJSON = function () {
    const num = Number(this);
    return Number.isSafeInteger(num) ? num : this.toString();
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`[API Server] Running successfully on: http://localhost:${port}/api`);
}
bootstrap();

})();

/******/ })()
;