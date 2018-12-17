package cs.service.sms.exception;

/**
 * @author Administrator
 *短信异常处理
 */
public class SMSException extends Exception {
    public SMSException() {
        super();
    }

    public SMSException(String message) {
        super(message);
    }

    public SMSException(String message, Throwable cause) {
        super(message, cause);
    }

    public SMSException(Throwable cause) {
        super(cause);
    }

    protected SMSException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
