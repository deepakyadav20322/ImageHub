## Diagram

```mermaid
erDiagram

    accounts {
        account_id uuid PK "not null"
        getting_started boolean "not null"
        settings json "not null"
        account_status text "not null"
        signup_source text "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
        invited_ids uuid[] "not null"
        preferences json "null"
        company_name text "null"
        facebook_page text "null"
        phone text "null"
        provider text "null"
        twitter_profile text "null"
        website text "null"
    }

    api_keys {
        api_key_id uuid PK "not null"
        account_id uuid FK "not null"
        user_id uuid FK "null"
        is_active boolean "not null"
        api_key text "not null"
        api_secret text "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
    }

    email_verification_tokens {
        id uuid PK "not null"
        user_id uuid FK "not null"
        account_id uuid FK "null"
        is_used boolean "not null"
        email character_varying "not null"
        token text "not null"
        created_at timestamp_with_time_zone "not null"
        expires_at timestamp_with_time_zone "not null"
        user_id uuid "not null"
        account_id uuid "null"
    }

    invites {
        invite_id uuid PK "not null"
        inviter_id uuid FK "not null"
        role_id uuid FK "not null"
        email text "not null"
        status text "not null"
        token text "not null"
        created_at timestamp_with_time_zone "not null"
        expires_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
    }

    permissions {
        permission_id uuid PK "not null"
        action text "not null"
        resource text "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
        description text "null"
    }

    resource_tags {
        resource_id uuid PK "not null"
        tag_id uuid PK "not null"
        resource_id uuid FK "not null"
        tag_id uuid FK "not null"
        created_at timestamp_with_time_zone "null"
    }

    resources {
        resource_id uuid PK "not null"
        account_id uuid FK "not null"
        parent_resource_id uuid FK "null"
        inherit_permissions boolean "not null"
        name text "not null"
        path text "not null"
        status text "not null"
        type text "not null"
        visibility text "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
        override_permissions boolean "null"
        metadata json "null"
        resource_type_details json "null"
        display_name text "null"
        version_id text "null"
        deleted_at timestamp_with_time_zone "null"
        expires_at timestamp_with_time_zone "null"
    }

    role_permissions {
        permission_id uuid FK "not null"
        role_id uuid FK "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
    }

    roles {
        role_id uuid PK "not null"
        name text "not null"
        created_at timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
        description text "null"
    }

    tags {
        tag_id uuid PK "not null"
        account_id uuid FK "not null"
        user_id uuid FK "not null"
        tag_name text "not null"
        account_id uuid "not null"
        usage_count integer "null"
        created_at timestamp_with_time_zone "null"
    }

    users {
        user_id uuid PK "not null"
        account_id uuid FK "not null"
        role_id uuid FK "not null"
        invited_by uuid FK "null"
        email_verified boolean "not null"
        first_name character_varying "not null"
        last_name character_varying "not null"
        email text "not null"
        created_at timestamp_with_time_zone "not null"
        last_login timestamp_with_time_zone "not null"
        updated_at timestamp_with_time_zone "not null"
        google_id text "null"
        password text "null"
        refresh_token text "null"
        user_status text "null"
        user_type text "null"
        product_environments text[] "null"
    }

    accounts ||--o{ api_keys : "api_keys(account_id) -> accounts(account_id)"
    accounts ||--o{ email_verification_tokens : "email_verification_tokens(account_id) -> accounts(account_id)"
    accounts ||--o{ resources : "resources(account_id) -> accounts(account_id)"
    accounts ||--o{ tags : "tags(account_id) -> accounts(account_id)"
    accounts ||--o{ users : "users(account_id) -> accounts(account_id)"
    permissions ||--o{ role_permissions : "role_permissions(permission_id) -> permissions(permission_id)"
    resources ||--o{ resource_tags : "resource_tags(resource_id) -> resources(resource_id)"
    resources ||--o{ resources : "resources(parent_resource_id) -> resources(resource_id)"
    roles ||--o{ invites : "invites(role_id) -> roles(role_id)"
    roles ||--o{ role_permissions : "role_permissions(role_id) -> roles(role_id)"
    roles ||--o{ users : "users(role_id) -> roles(role_id)"
    tags ||--o{ resource_tags : "resource_tags(tag_id) -> tags(tag_id)"
    users ||--o{ api_keys : "api_keys(user_id) -> users(user_id)"
    users ||--o{ email_verification_tokens : "email_verification_tokens(user_id) -> users(user_id)"
    users ||--o{ invites : "invites(inviter_id) -> users(user_id)"
    users ||--o{ tags : "tags(user_id) -> users(user_id)"
    users ||--o{ users : "users(invited_by) -> users(user_id)"
```

## Indexes

### `accounts`

- `accounts_pkey`

### `api_keys`

- `api_keys_api_key_unique`
- `api_keys_pkey`

### `email_verification_tokens`

- `email_verification_tokens_pkey`
- `email_verification_tokens_user_id_account_id_unique`

### `invites`

- `invites_pkey`
- `invites_token_unique`

### `permissions`

- `permissions_pkey`

### `resource_tags`

- `resource_tags_resource_id_tag_id_pk`
- `resource_tags_tag_id_idx`

### `resources`

- `resources_pkey`

### `role_permissions`

- `unique_role_permission`

### `roles`

- `roles_name_unique`
- `roles_pkey`

### `tags`

- `tags_pkey`
- `unique_account_tag`

### `users`

- `users_email_unique`
- `users_google_id_unique`
- `users_pkey`
