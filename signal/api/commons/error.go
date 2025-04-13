package commons

import "fmt"

type CustomError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *CustomError) Error() string {
	return fmt.Sprintf("Erorr %d: %s", e.Code, e.Message)
}

func NewError(code int, message string) *CustomError {
	return &CustomError{
		Code:    code,
		Message: message,
	}
}

// StatusCodeEnum is an enumeration of HTTP status codes

const (
	// Success status codes
	StatusOK             int = 200
	StatusCreated        int = 201
	StatusAccepted       int = 202
	StatusOKNoContent    int = 204
	StatusPartialContent int = 206

	// Client Error status codes
	StatusBadRequest                   int = 400
	StatusUnauthorized                 int = 401
	StatusPaymentRequired              int = 402
	StatusForbidden                    int = 403
	StatusNotFound                     int = 404
	StatusMethodNotAllowed             int = 405
	StatusNotAcceptable                int = 406
	StatusProxyAuthRequired            int = 407
	StatusRequestTimeout               int = 408
	StatusConflict                     int = 409
	StatusGone                         int = 410
	StatusLengthRequired               int = 411
	StatusPreconditionFailed           int = 412
	StatusRequestEntityTooLarge        int = 413
	StatusRequestURITooLong            int = 414
	StatusUnsupportedMediaType         int = 415
	StatusRequestedRangeNotSatisfiable int = 416
	StatusExpectationFailed            int = 417
	StatusTeapot                       int = 418
	StatusMisdirectedRequest           int = 421
	StatusUnprocessableEntity          int = 422
	StatusLocked                       int = 423
	StatusFailedDependency             int = 424
	StatusUpgradeRequired              int = 426
	StatusPreconditionRequired         int = 428
	StatusTooManyRequests              int = 429
	StatusRequestHeaderFieldsTooLarge  int = 431
	StatusUnavailableForLegalReasons   int = 451
	StatusClientClosedRequest          int = 499
	StatusInternalServerError          int = 500
	StatusNotImplemented               int = 501
	StatusBadGateway                   int = 502
	StatusServiceUnavailable           int = 503
	StatusGatewayTimeout               int = 504
	StatusHTTPVersionNotSupported      int = 505
)

// Error messages
const (
	// Success messages
	MessageOK             string = "OK"
	MessageCreated        string = "Created"
	MessageAccepted       string = "Accepted"
	MessageOKNoContent    string = "No Content"
	MessagePartialContent string = "Partial Content"
	// Client error messages
	MessageBadRequest        string = "Bad Request"
	MessageUnauthorized      string = "Unauthorized"
	MessagePaymentRequired   string = "Payment Required"
	MessageForbidden         string = "Forbidden"
	MessageNotFound          string = "Not Found"
	MessageMethodNotAllowed  string = "Method Not Allowed"
	MessageNotAcceptable     string = "Not Acceptable"
	MessageProxyAuthRequired string = "Proxy Authentication Required"
	MessageRequestTimeout    string = "Request Timeout"
	InternalServerError      string = "Internal Server Error"
)

// APIError define API error when response status is 4xx or 5xx
type APIError struct {
	Code     int64  `json:"code"`
	Message  string `json:"msg"`
	Response []byte `json:"-"` // Assign the body value when the Code and Message fields are invalid.
}

// Error return error code and message
func (e APIError) Error() string {
	if e.IsValid() {
		return fmt.Sprintf("<APIError> code=%d, msg=%s", e.Code, e.Message)
	}
	return fmt.Sprintf("<APIError> rsp=%s", string(e.Response))
}

func (e APIError) IsValid() bool {
	return e.Code != 0 || e.Message != ""
}

// IsAPIError check if e is an API error
func IsAPIError(e error) bool {
	_, ok := e.(*APIError)
	return ok
}
