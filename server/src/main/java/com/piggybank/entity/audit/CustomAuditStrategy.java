package com.piggybank.entity.audit;

import org.hibernate.Session;
import org.hibernate.envers.configuration.Configuration;
import org.hibernate.envers.strategy.internal.DefaultAuditStrategy;
import org.springframework.data.domain.Auditable;

import java.util.Map;

public class CustomAuditStrategy extends DefaultAuditStrategy {
    @Override
    public void perform(Session session, String entityName, Configuration configuration, Object id, Object data, Object revision) {
        // Call the default behavior for versioning and auditing
        super.perform(session, entityName, configuration, id, data, revision);

        // Now add custom fields (createdBy, lastModifiedBy, createdDate, lastModifiedDate)
        if (data instanceof Auditable) {
            Auditable auditableEntity = (Auditable) data;

            // You may need to cast 'revision' if needed to your revision entity (e.g., 'RevisionInfoEntity')
            // For now, assuming it is a generic object
            Map<String, Object> revisionMap = (Map<String, Object>) revision;

            // Add createdBy, lastModifiedBy, createdDate, and lastModifiedDate to the revisionMap
            revisionMap.put("createdBy", auditableEntity.getCreatedBy());
            revisionMap.put("lastModifiedBy", auditableEntity.getLastModifiedBy());
            revisionMap.put("createdDate", auditableEntity.getCreatedDate());
            revisionMap.put("lastModifiedDate", auditableEntity.getLastModifiedDate());
        }
    }
}