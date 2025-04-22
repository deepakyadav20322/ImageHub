import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ErrorRequestHandler } from 'express';

export const handleUploadMulterErrors: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({
                success: false,
                message: 'File size too large. Maximum allowed size is 5MB',
                maxSize: '5MB'
            });
            return;
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({
                success: false,
                message: 'Too many files uploaded. Maximum 10 files with total 5MB allowed'
            });
            return;
        }

        res.status(400).json({
            success: false,
            message: 'Multer error: ' + err.message
        });
        return;
    }

    if (err) {
        res.status(400).json({
            success: false,
            message: err.message || 'File upload failed'
        });
        return;
    }

    next();
};
