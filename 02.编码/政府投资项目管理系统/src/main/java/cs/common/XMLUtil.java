package cs.common;

import com.sun.xml.internal.bind.marshaller.CharacterEscapeHandler;
import cs.model.SendMsg;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.adapters.XmlAdapter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

public class XMLUtil {

    /**
     * 将实例对象转换为XML
     *
     * @param obj
     * @return
     * @throws JAXBException
     */
    public static String toXml(Object obj) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(obj.getClass());
        Marshaller marshaller = context.createMarshaller();

        // 设置编码格式
        marshaller.setProperty(Marshaller.JAXB_ENCODING, "UTF-8");
        // 设置是否格式化输出
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, false);
        // 设置是否输入XML头
        marshaller.setProperty(Marshaller.JAXB_FRAGMENT, true);
        // 阻止JAXB进行的转义动作（CDATA的'<'和'>'会被转译为'&lt;'和'&gt;'）
        marshaller.setProperty(CharacterEscapeHandler.class.getName(), new CharacterEscapeHandler() {
            @Override
            public void escape(char[] chars, int i, int i1, boolean b, Writer writer) throws IOException {
                writer.write(chars, i, i1);
            }
        });

        StringWriter writer = new StringWriter();
        marshaller.marshal(obj, writer);
        return writer.toString();
    }

    public static class CDATAAdapter extends XmlAdapter<String, String> {

        @Override
        public String unmarshal(String v) throws Exception {
            return null;
        }

        @Override
        public String marshal(String v) throws Exception {
            return "<![CDATA[" + v + "]]>";
        }
    }

}
