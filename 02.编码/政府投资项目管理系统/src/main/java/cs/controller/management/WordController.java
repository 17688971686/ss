package cs.controller.management;

import com.sn.framework.common.SnRuntimeException;
import cs.common.SNKit;
import cs.common.Util;
import cs.domain.Attachment;
import cs.service.interfaces.AttachmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Map;

/**
 * Created by mrx on 2017/9/27.
 */
@Controller
@RequestMapping(name = "在线Word", path = "management/word")
public class WordController {
    private final static Logger logger = LoggerFactory.getLogger(WordController.class);

    @Autowired
    AttachmentService attachmentService;

    public final static String streetPostingPath = "oa".concat(File.separator).concat("streetPosting").concat(File.separator);

    @Value("${diskPath}")
    private String diskPath;

    @RequestMapping(name = "word在线编辑", path = "html/online")
    public String online(Map<String, Object> parmas, HttpServletRequest request) {
        String attachId = request.getParameter("attachId");
        if(!Util.isNotNull(attachId)){
            throw new IllegalArgumentException("无法编辑！");
        }
        parmas.put("attachId",attachId);
        parmas.put("basePath", SNKit.getBasePath(request));
        parmas.put("sessionId", request.getSession(true).getId());
        return "management/word/wordOnline";
    }

    /**
     * 文件附件ID下载Word文件
     *
     * @param attachId
     * @param response
     * @return
     * @Description:
     */
    @RequestMapping(name = "下载服务器Word", path = "download/{attachId}")
    public void downloadByDocId(@PathVariable String attachId, HttpServletRequest request, HttpServletResponse response) {
        logger.debug("下载文件 {}", attachId);
        //根据发文id查询发文信息
        Attachment attachment = attachmentService.findById(attachId);
        String fileName = null;
        if (null != attachment) {
            // TODO 过滤下载的文件格式，只能是支持在线编辑的格式

            // TODO部署环境的时候需要修改
            fileName = attachment.getUrl();
            //fileName = "word_online.doc";
            //下载文件
            File file = new File(diskPath,fileName);
            if (file.exists()) {
                SNKit.fileDownload(request, response, file, fileName);
            } else {
                throw new SnRuntimeException("文件不存在");
            }
        } else {
            throw new SnRuntimeException("文件不存在");
        }
    }

    @PostMapping(name = "上传word", path = "upload")
    public void upload(@RequestParam String attachId, MultipartFile docContent, HttpServletResponse response) throws UnsupportedEncodingException {
        Assert.notNull(docContent, "缺少上传的word文件");
        // TODO 过滤上传的文件格式，只能是支持在线编辑的格式
        if (logger.isDebugEnabled()) {
            logger.debug("上传文件 {}", attachId);
        }
        //更新附件表信息
        attachmentService.uploadWord(docContent, attachId);
        SNKit.printJsonMsg(response, HttpStatus.OK, "succeed");
    }

}
