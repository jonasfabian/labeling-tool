package ch.fhnw.labeling_tool.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
@ConfigurationProperties(prefix = "labeling-tool", ignoreUnknownFields = false)

public class LabelingToolConfig {
    private Path basePath;
    private String condaExec;

    public Path getBasePath() {
        return basePath;
    }

    public void setBasePath(Path basePath) {
        this.basePath = basePath;
    }

    public String getCondaExec() {
        return condaExec;
    }

    public void setCondaExec(String condaExec) {
        this.condaExec = condaExec;
    }
}
