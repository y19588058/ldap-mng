class Password
  include ActiveModel::Model

  attr_accessor :uid, :password_old, :password, :password_confirmation

  validates :uid, :presence => {:message => 'ユーザIDを入力してください'}
  VALID_UID_REGEX = /\A[\w.-]*[A-Za-z][\w.-]*\z/i
  validates :uid, :format => { :with => VALID_UID_REGEX, :message => 'ユーザIDのフォーマットが正しくありません'}

  validates :password_old, :presence => {:message => '変更前パスワードを入力してください'}

  validates :password, :presence => {:message => '変更後パスワードを入力してください'}
  validates_confirmation_of :password, :message => '変更後パスワードが一致しません'
  validates :password, :length => {:minimum => 8, :message => 'パスワードは8文字以上にしてください'}
  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@\[-`{-~])[!-~]+\z/i
  validates :password, :format => { :with => VALID_PASSWORD_REGEX, :message => 'パスワードは英・数・記号を一文字ずつ以上含めてください'}
  validates_exclusion_of :uid, in: :password, :message => 'パスワードにユーザーIDを含めないでください'

end
