Rails.application.routes.draw do
  get "/messages/get_data", to: "messages#get_data"
  resources :messages
  mount_devise_token_auth_for 'User', at: 'auth'
  get "/students/check_email", to: "students#check_email"
  get "/companies/check_email", to: "companies#check_email"
  get "/students/get_data", to: "students#get_data"

  resources :companies
  resources :students
  resources :logintests
  # NotesのAPIルートだけ許可（GET, POST）
  resources :notes, only: [:index, :create]





  # ヘルスチェックなど不要であれば削除してOK
  # get "up" => "rails/health#show", as: :rails_health_check

  # rootルートを指定したい場合は必要に応じて
  # root "notes#index"
end
