export const GlobalError =  (err, req, res, next) => {
    let code = err.statusCode||500
  res.status(code).json({ error: 'some errors in the global..', message: err.message , code: code});
}
