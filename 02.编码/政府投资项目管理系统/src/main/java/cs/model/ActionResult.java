package cs.model;
/**
 * @Description:短信接口返回信息实体 
 * @author: cx
 * @Date：2017年7月11日
 * @version：0.1
 */
public class ActionResult {
        public Head head;
        public Body body;
        
		public Head getHead() {
			return head;
		}
		
		public void setHead(Head head) {
			this.head = head;
		}
		
		public Body getBody() {
			return body;
		}
		
		public void setBody(Body body) {
			this.body = body;
		}
		
    public class Head{     
        public int code;
        public String message;
		public int getCode() {
			return code;
		}
		public void setCode(int code) {
			this.code = code;
		}
		public String getMessage() {
			return message;
		}
		public void setMessage(String message) {
			this.message = message;
		}
        
    }
    
    public class Body
    {
        public String[] msgid;
        public String reserve;
        
		public String[] getMsgid() {
			return msgid;
		}
		public void setMsgid(String[] msgid) {
			this.msgid = msgid;
		}
		public String getReserve() {
			return reserve;
		}
		public void setReserve(String reserve) {
			this.reserve = reserve;
		}
    }
}
