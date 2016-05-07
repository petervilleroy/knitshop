class User < ActiveRecord::Base
  has_secure_password
  before_save { self.email = email.downcase }
  validates :first_name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 },
            uniqueness: { case_sensitive: false },
            format: {
               with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
            }
  validates :password, length: { minimum: 3 }
  def to_s
    "#{first_name}"
  end
end
