module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    };

    // Also check for passport's default error message
    if (!res.locals.flash.error || res.locals.flash.error.length === 0) {
        const passportError = req.flash('error');
        if (passportError && passportError.length > 0) {
            res.locals.flash.error = passportError;
        }
    }

    next();
}