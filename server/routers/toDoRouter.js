import { pool } from '../helper/db.js';
import { Router } from 'express';
// import { emptyOrRows } from '../helper/utils.js';
import { auth } from '../helper/auth.js';
import { getTasks, postTask } from '../controllers/TaskController.js'


const router = Router();

router.get('/', getTasks);
router.post('/create', auth, postTask);

// router.get('/', (req, res, next) => {
//     pool.query('SELECT * FROM task', (error, result) => {
//         if (error) {
//             return next(error);
//         }
//         return res.status(200).json(emptyOrRows(result));
//     });
// });

// router.post('/create', auth, (req, res, next) => {
//     pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *',
//         [req.body.description],
//         (error, result) => {
//             if (error) {
//                 return next(error);
//             }
//             return res.status(200).json({ id: result.rows[0].id });
//         }
//     );
// });

router.delete('/delete/:id', auth, (req, res, next) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM task WHERE id = $1',
        [id],
        (error, result) => {
            if (error) {
                return next(error);
            }
            return res.status(200).json({ id: id });
        }
    );
});

export default router;