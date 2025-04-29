class LogintestsController < ApplicationController
  before_action :set_logintest, only: %i[ show update destroy ]

  # GET /logintests
  def index
    @logintests = Logintest.all

    render json: @logintests
  end

  # GET /logintests/1
  def show
    render json: @logintest
  end

  # POST /logintests
  def create
    @logintest = Logintest.new(logintest_params)

    if @logintest.save
      render json: @logintest, status: :created, location: @logintest
    else
      render json: @logintest.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /logintests/1
  def update
    if @logintest.update(logintest_params)
      render json: @logintest
    else
      render json: @logintest.errors, status: :unprocessable_entity
    end
  end

  # DELETE /logintests/1
  def destroy
    @logintest.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_logintest
      @logintest = Logintest.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def logintest_params
      params.expect(logintest: [ :email, :password ])
    end
end
