# Production Deployment Checklist

## Pre-Deployment (1-2 weeks before launch)

### Security Review
- [ ] Run security audit of codebase
- [ ] Review all API endpoints for vulnerabilities
- [ ] Check password hashing implementation
- [ ] Verify input validation on all endpoints
- [ ] Test XSS prevention with payloads
- [ ] Verify CORS configuration
- [ ] Review session management
- [ ] Test payment flow with Razorpay sandbox

### Code Quality
- [ ] Run linter (flake8, pylint)
- [ ] Review code for SQL injection vulnerabilities
- [ ] Check for hardcoded credentials
- [ ] Verify error handling
- [ ] Review logging implementation
- [ ] Check for memory leaks
- [ ] Performance testing with load tools

### Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] End-to-end testing of checkout flow
- [ ] Payment flow testing (sandbox)
- [ ] Login/logout functionality
- [ ] Admin operations
- [ ] Error scenarios

### Documentation
- [ ] Update README with deployment info
- [ ] Document all API endpoints
- [ ] Create admin user guide
- [ ] Document error codes and meanings
- [ ] Create troubleshooting guide
- [ ] Document database schema (if applicable)

---

## Deployment Week

### Environment Setup
- [ ] Generate strong `SECRET_KEY` (32+ characters)
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

- [ ] Obtain SSL/TLS certificate
  - [ ] Use Let's Encrypt (free)
  - [ ] Or purchase from certificate authority
  - [ ] Test certificate installation

- [ ] Configure production server
  - [ ] Install OS updates
  - [ ] Configure firewall rules
  - [ ] Set up SSH key access
  - [ ] Disable root login

### Application Setup
- [ ] Deploy code to production server
- [ ] Create production `.env` file
- [ ] Set all environment variables
- [ ] Install production dependencies
- [ ] Run database migrations (if applicable)
- [ ] Create database backups

### Web Server Configuration
- [ ] Install Nginx/Apache
- [ ] Configure reverse proxy
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers
- [ ] Set up gzip compression
- [ ] Configure caching

### Payment Gateway
- [ ] Activate Razorpay production account
- [ ] Obtain production API keys
- [ ] Add keys to `.env` file
- [ ] Test payment flow with live keys
- [ ] Set up webhook handling (if applicable)
- [ ] Configure email notifications

### Monitoring & Logging
- [ ] Set up application logging
- [ ] Configure log rotation
- [ ] Set up error tracking (Sentry/Rollbar)
- [ ] Configure uptime monitoring
- [ ] Set up alerting

---

## Deployment Day

### Pre-Deployment Checks
- [ ] Backup current database
- [ ] Backup current application files
- [ ] Notify stakeholders of deployment
- [ ] Have rollback plan ready
- [ ] Test all endpoints one more time

### Deployment
- [ ] Deploy application code
- [ ] Verify deployment successful
- [ ] Check application logs for errors
- [ ] Test critical user flows
- [ ] Verify payment processing
- [ ] Monitor error rates
- [ ] Check response times

### Post-Deployment Verification
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test payment processing (small amount)
- [ ] Test admin panel
- [ ] Verify HTTPS working
- [ ] Check security headers
- [ ] Verify email notifications (if applicable)

---

## Post-Deployment (1-2 weeks after launch)

### Monitoring
- [ ] Review server logs daily
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Monitor payment success rate
- [ ] Track user feedback

### Security Monitoring
- [ ] Check for suspicious login attempts
- [ ] Review admin action logs
- [ ] Monitor for SQL injection attempts
- [ ] Check for XSS attempts
- [ ] Review CORS access logs

### Performance
- [ ] Analyze response times
- [ ] Check database query performance
- [ ] Monitor server resource usage
- [ ] Identify and fix slow endpoints

### User Feedback
- [ ] Respond to user issues
- [ ] Monitor support tickets
- [ ] Track common issues
- [ ] Plan for hotfixes

---

## Ongoing Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check server disk space
- [ ] Monitor database size
- [ ] Verify backups completed

### Monthly
- [ ] Security update reviews
- [ ] Dependency updates
- [ ] Performance analysis
- [ ] User feedback review

### Quarterly
- [ ] Security audit
- [ ] Code review
- [ ] Database optimization
- [ ] Capacity planning

### Annually
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Compliance audit
- [ ] Disaster recovery testing

---

## Environment Variables (Production)

```bash
# Application
SECRET_KEY=<strong-32-char-key>
FLASK_ENV=production
FLASK_DEBUG=False

# Payment Gateway
RAZORPAY_KEY_ID=<production-key-id>
RAZORPAY_KEY_SECRET=<production-key-secret>

# Database (if applicable)
DATABASE_URL=postgresql://user:password@host:5432/db
DATABASE_POOL_SIZE=20
DATABASE_POOL_RECYCLE=3600

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/app.log

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
```

---

## Emergency Procedures

### Application Down
1. Check server status: `systemctl status app.service`
2. View logs: `sudo journalctl -u app.service -n 50`
3. Restart service: `sudo systemctl restart app.service`
4. If still down, prepare rollback

### Payment Gateway Issues
1. Check Razorpay status page
2. Verify API keys are correct
3. Check network connectivity
4. Review error logs
5. If down >30 min, switch to manual payment mode

### Database Issues
1. Check database connectivity
2. Verify database service running
3. Check disk space
4. Review slow query logs
5. Restore from backup if necessary

### Security Incident
1. Revoke compromised credentials
2. Rotate encryption keys
3. Check access logs
4. Notify affected users
5. Document incident for review

---

## Rollback Procedure

### If Deployment Fails
```bash
# 1. Stop application
sudo systemctl stop app.service

# 2. Restore previous code
git checkout <previous-tag>

# 3. Restore previous database state (if needed)
psql < backup_previous.sql

# 4. Start application
sudo systemctl start app.service

# 5. Verify services working
curl http://localhost:5000/health
```

### Communication Template
```
Subject: Production Issue - [Component]

We experienced [brief description] at [time].

Current Status: [investigating/mitigating/resolved]
Impact: [number of users/orders affected]
ETR: [estimated time to resolution]

We will provide updates every [X minutes].

Sincerely,
[Team Name]
```

---

## Performance Targets

- Page load time: < 2 seconds
- API response time: < 500ms
- Checkout completion time: < 30 seconds
- Payment processing: < 5 seconds
- Uptime: > 99.9%
- Error rate: < 0.1%

---

## Monitoring Tools (Recommended)

### Uptime Monitoring
- Pingdom
- UptimeRobot
- Datadog

### Error Tracking
- Sentry
- Rollbar
- New Relic

### Logging
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- Loggly

### Performance Monitoring
- New Relic
- Datadog
- Prometheus

---

## Support Contacts

- **Technical Issues**: [contact]
- **Payment Issues**: Razorpay Support (support@razorpay.com)
- **Security Issues**: [security email]
- **General Questions**: [support email]

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Dev Lead | | | |
| QA Lead | | | |
| Security | | | |
| Ops | | | |
| Product | | | |

---

## Notes

Use this section for deployment-specific notes:

```
[Add any deployment-specific notes here]
```

---

**Last Updated**: [Date]  
**Next Review**: [Date]  
**Version**: 1.0
