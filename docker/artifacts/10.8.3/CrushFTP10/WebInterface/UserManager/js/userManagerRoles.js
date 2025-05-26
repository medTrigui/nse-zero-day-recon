window.userManager = window.userManager || {};
userManager.userRoles = [
  {
    "label": "User manager actions",
    "items": [
      {
        "label": "Allow batch updating",
        "key": "batch_update"
      }
    ]
  },
  {
    "label": "Menu Action Items",
    "items": [
      {
        "label": "Create New User",
        "key": "create_user"
      },
      {
        "label": "Delete Selected User",
        "key": "delete_user"
      },
      {
        "label": "Modify Inheritance",
        "key": "modify_inheritance"
      }
    ]
  },{
    "label": "Setup",
    "items": [
      {
        "label": "Account enable/disable, user name, password",
        "key": "account_info"
      },
      {
        "label": "Enable/Disable Account",
        "key": "account_enabled"
      },
      {
        "label": "User Name",
        "key": "user_name"
      },
      {
        "label": "Password",
        "key": "password"
      },
      {
        "label": "Salt setup",
        "key": "salt"
      },
      {
        "label": "Auto Set Password on next login",
        "key": "auto_set_pass"
      },
      {
        "label": "User Phone",
        "key": "phone"
      },
      {
        "label": "Use two factor sms authentication (OTP)",
        "key": "otp_auth"
      },
      {
        "label": "User Info (Email, first name, last name)",
        "key": "user_info"
      },
      {
        "label": "User Email",
        "key": "email"
      },
      {
        "label": "User First Name",
        "key": "first_name"
      },
      {
        "label": "User Last Name",
        "key": "last_name"
      },
      {
        "label": "Send user info via email",
        "key": "sendUserPassInfoMail"
      },
      {
        "label": "VFS Setup",
        "key": "VFS"
      },
      {
        "label": "VFS Quota Settings",
        "key": "VFS_Quota"
      },
      {
        "label": "VFS Linking",
        "key": "VFS_LINKING"
      }
    ]
  },
  {
    "label": "Settings",
    "items": [
      {
        "label": "Max Login Time",
        "key": "max_login_time"
      },
      {
        "label": "Max Idle Time",
        "key": "max_idle_time"
      },
      {
        "label": "Max Upload Speed",
        "key": "speed_limit_upload"
      },
      {
        "label": "Minimum Upload Speed",
        "key": "min_upload_speed"
      },
      {
        "label": "Max Download Speed",
        "key": "speed_limit_download"
      },
      {
        "label": "Minimum Download Speed",
        "key": "min_download_speed"
      },
      {
        "label": "Download to Upload Ratio",
        "key": "ratio"
      },
      {
        "label": "Max Upload Individual File Size",
        "key": "max_upload_size"
      },
      {
        "label": "Max Upload Amount Per Session",
        "key": "max_upload_amount"
      },
      {
        "label": "Max Upload Amount Per Day",
        "key": "max_upload_amount_day"
      },
      {
        "label": "Max Upload Amount Per Month",
        "key": "max_upload_amount_month"
      },
      {
        "label": "Clear Upload Transfer Amount",
        "key": "clearMaxTransferAmtUpload"
      },
      {
        "label": "Max Download Amount Per Session",
        "key": "max_download_amount"
      },
      {
        "label": "Max Download Amount Per Day",
        "key": "max_download_amount_day"
      },
      {
        "label": "Max Download Amount Per Month",
        "key": "max_download_amount_month"
      },
      {
        "label": "Max Upload Count Per Session",
        "key": "max_upload_count"
      },
      {
        "label": "Max Upload Count Per Day",
        "key": "max_upload_count_day"
      },
      {
        "label": "Max Upload Count Per Month",
        "key": "max_upload_count_month"
      },
      {
        "label": "Max Download Count Per Session",
        "key": "max_download_count"
      },
      {
        "label": "Max Download Count Per Day",
        "key": "max_download_count_day"
      },
      {
        "label": "Max Download Count Per Month",
        "key": "max_download_count_month"
      },
      {
        "label": "Disable Partial Download",
        "key": "partial_download"
      },
      {
        "label": "Directory Size Calculation",
        "key": "dir_calc"
      },
      {
        "label": "Directory Count Calculation",
        "key": "dir_calc_count"
      },
      {
        "label": "AS2/3 Decryption Key",
        "key": "as2EncryptKeystorePath"
      },
      {
        "label": "AS2/3 Signature Verification Key",
        "key": "as2SignKeystorePath"
      },
      {
        "label": "Process As3 Files",
        "key": "as3_allowed"
      },
      {
        "label": "Dir to use for Quota",
        "key": "parent_quota_dir"
      },
      {
        "label": "User level quota",
        "key": "quota_mb"
      }
    ]
  },
  {
    "label": "Restrictions",
    "items": [
      {
        "label": "Account Expiration",
        "key": "account_expire"
      },
      {
        "label": "Password Expiration",
        "key": "expire_password_days"
      },
      {
        "label": "Max Simultaneous Login",
        "key": "max_logins"
      },
      {
        "label": "Disable account after too many login attempts",
        "key": "failure_count_max"
      },
      {
        "label": "Hammering Successful Logins Setting",
        "key": "login_hammer_attempts"
      },
      {
        "label": "Max Logins Per IP",
        "key": "max_logins_ip"
      },
      {
        "label": "Ignore Server's Max Connections and Always Allow Login",
        "key": "ignore_max_logins"
      },
      {
        "label": "Allow User to Connect to These Days",
        "key": "day_of_week_allow"
      },
      {
        "label": "Hours of the day a user may connect",
        "key": "hours_of_day"
      },
      {
        "label": "Allow receiving of shared items from other users",
        "key": "allow_user_shares"
      },
      {
        "label": "IP Restrictions",
        "key": "ip_restrictions"
      },
      {
        "label": "Max connections per protocol",
        "key": "CONNECTIONS_PER_PROTOCOL"
      },
      {
        "label": "Require encryption?",
        "key": "require_encryption"
      },
      {
        "label": "List of paths to trusted public SSH key files",
        "key": "ssh_public_keys"
      },
      {
        "label": "Require public key and password for authentication",
        "key": "publickey_password"
      },
      {
        "label": "Require public key and keyboard interactive for authentication",
        "key": "publickey_keyboardinteractive"
      },
      {
        "label": "PGP Key Setup",
        "key": "PGP_SETUP"
      },
      {
        "label": "Content Restriction",
        "key": "content_restriction"
      }
    ]
  },
  {
    "label": "Admin",
    "items": [
      {
        "label": "SITE",
        "key": "SITE"
      },
      {
        "label": "User can administer group",
        "key": "admin_group_name"
      },
      {
        "label": "Unsafe Password Characters",
        "key": "unsafe_password_chars"
      },
      {
        "label": "Number of characters for random passwords",
        "key": "random_password_length"
      },
      {
        "label": "New password minimum length",
        "key": "min_password_length"
      },
      {
        "label": "Minimum numeric characters",
        "key": "min_password_numbers"
      },
      {
        "label": "Minimum lower case characters",
        "key": "min_password_lowers"
      },
      {
        "label": "Minimum upper case characters",
        "key": "min_password_uppers"
      },
      {
        "label": "Minimum special characters",
        "key": "min_password_specials"
      },
      {
        "label": "Password history count",
        "key": "password_history_count"
      }
    ]
  },
  {
    "label": "Events",
    "items": [
      {
        "label": "Events",
        "key": "events"
      }
    ]
  },
  {
    "label": "WebInterface",
    "items": [
      {
        "label": "Customizations",
        "key": "web_customizations"
      },
      {
        "label": "Custom Javascript",
        "key": "javascript"
      },
      {
        "label": "Custom CSS",
        "key": "css"
      },
      {
        "label": "Buttons",
        "key": "web_buttons"
      },
      {
        "label": "Forms",
        "key": "forms"
      },
      {
        "label": "Virtual Domains",
        "key": "domain_root_list"
      },
      {
        "label": "Alternate HTTP Domains",
        "key": "alt_http_domains"
      },
      {
        "label": "Disallow directory listings",
        "key": "DisallowListingDirectories"
      },
      {
        "label": "Recaptcha required for WebInterface logins",
        "key": "recaptcha_required_web"
      },
      {
        "label": "Enable ServerSideInclude (SSI)",
        "key": "WebServerSSI"
      },
      {
        "label": "Serve HTML 'index.html' file instead of directory listing",
        "key": "WebServerMode"
      }
    ]
  },
  {
    "label": "Tunnels",
    "items": [
      {
        "label": "Tunnel",
        "key": "tunnels"
      }
    ]
  },
  {
    "label": "Misc",
    "items": [
      {
        "label": "FTP Welcome Message",
        "key": "welcome_message"
      },
      {
        "label": "Character Encoding",
        "key": "char_encoding"
      },
      {
        "label": "POSIX",
        "key": "posix"
      },
      {
        "label": "Timezone Offset",
        "key": "timezone_offset"
      },
      {
        "label": "File extension to add to uploads that are in progress",
        "key": "temp_upload_ext"
      },
      {
        "label": "Disable MDTM modifications",
        "key": "disable_mdtm_modifications"
      },
      {
        "label": "Filename filters",
        "key": "file_filter"
      },
      {
        "label": "Block access to any path matching these patterns",
        "key": "block_access"
      },
      {
        "label": "Notes about this user",
        "key": "notes"
      },
      {
        "label": "Extra Text Reference",
        "key": "extraTextReference"
      },
      {
        "label": "Custom User Session Log Path",
        "key": "user_log_path"
      }
    ]
  }
];