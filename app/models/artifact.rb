class Artifact < ActiveRecord::Base
  belongs_to :user
  has_many :favorites
  has_many :users, through: :favorites

  has_attached_file :uimage
  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :uimage, :content_type => /\Aimage\/.*\Z/
end
