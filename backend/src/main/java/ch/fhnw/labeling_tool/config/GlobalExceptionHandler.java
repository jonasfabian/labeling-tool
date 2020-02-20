package ch.fhnw.labeling_tool.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(getClass());

//    @ExceptionHandler({Exception.class})
//    public ResponseEntity iOException(Exception e) {
//        HashMap<String, String> response = new HashMap<>();
//        logger.warn("dataset upload failed. please verify data format: ", e);
//        response.put("message", "dataset upload failed. please verify data format.");
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//    }
}
