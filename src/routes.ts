import { Router } from "express"
import { CellController } from "./controller/CellController"
import { UserController } from "./controller/UserController"
import { AuthMiddlewares } from "./middlewares/auth"

const userController = new UserController()
const cellController = new CellController()

export const router = Router()

router.post('/create', userController.create)
router.post('/auth', userController.authenticate)
// Só pode ser acessada se tiver logado, ou seja, com token válido
router.put('/update-table/:idCell', AuthMiddlewares, cellController.update)
router.get('/cells/:idTable', AuthMiddlewares, cellController.read)