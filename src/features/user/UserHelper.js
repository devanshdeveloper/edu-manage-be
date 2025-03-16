const ModelHelper = require("../../helpers/ModelHelper");
const User = require("../auth/User.model");
const AuthStateHelper = require("../../helpers/AuthStateHelper");

class UserHelper extends ModelHelper {
  constructor() {
    super(User);
    this.authStateHelper = new AuthStateHelper();
  }

  // Add user-specific methods here
  async findByEmail(email) {
    return this.findOne({ email });
  }

  async updatePassword(id, password) {
    return this.update(id, { password });
  }

  async verifyEmail(id) {
    return this.update(id, { emailVerified: true });
  }

  async updateProfile(id, data) {
    const allowedFields = ["name", "address", "phone", "avatar"];
    const updateData = {};

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = data[key];
      }
    });

    return this.update(id, updateData);
  }

  async Response(user) {
    if (!user) {
      return null;
    }

    if (typeof user === "string") {
      user = await this.findById(user);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      avatar: user.avatar,
    };
  }

  async getCurrentAuthState(userId) {
    const user = await this.findById(userId);
    return user ? user.authState : null;
  }

  async updateAuthState(userId, newState) {
    if (!this.authStateHelper.isValidState(newState)) {
      throw new Error('Invalid authentication state');
    }

    const currentState = await this.getCurrentAuthState(userId);
    if (!this.authStateHelper.isValidTransition(currentState, newState)) {
      throw new Error('Invalid state transition');
    }

    return await this.update(userId, { authState: newState });
  }

  async progressToNextState(userId) {
    const currentState = await this.getCurrentAuthState(userId);
    const nextState = this.authStateHelper.getNextState(currentState);

    if (!nextState) {
      throw new Error('Already in final state');
    }

    return await this.updateAuthState(userId, nextState);
  }

  async validateStateRequirements(userId, requiredStates) {
    const currentState = await this.getCurrentAuthState(userId);
    return this.authStateHelper.areRequiredStatesCompleted(currentState, requiredStates);
  }

  async resetAuthState(userId) {
    const initialState = this.authStateHelper.getInitialState();
    return await this.update(userId, { authState: initialState });
  }

  async isInFinalState(userId) {
    const currentState = await this.getCurrentAuthState(userId);
    return this.authStateHelper.isFinalState(currentState);
  }
}

module.exports = UserHelper;
