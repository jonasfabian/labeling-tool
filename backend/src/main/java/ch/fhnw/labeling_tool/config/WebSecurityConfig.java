package ch.fhnw.labeling_tool.config;


import ch.fhnw.labeling_tool.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    @Autowired
    public WebSecurityConfig(CustomUserDetailsService userDetailsService, PasswordEncoder passwordEncoder, Environment env) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        var conf = http.authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/admin/**").access("hasRole('admin')")
                .antMatchers("/api/**").fullyAuthenticated()
                .and()
                .httpBasic()
                .realmName("test")
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .and()
                .logout()
                .logoutUrl("/api/logout")
                .and().csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        if (Arrays.asList(env.getActiveProfiles()).contains("dev-test")) {
            // see https://stackoverflow.com/a/54932272
            conf.and().cors().and().csrf().disable();
        }
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
    }
}
