// eslint-disable-next-line no-unused-vars
const ExampleRepository = require('../../repositories/example.repository')
// eslint-disable-next-line no-unused-vars
const Example = require('../../entities/example')
// eslint-disable-next-line no-unused-vars
const winston = require('winston')
const { ObjectId } = require('mongodb') // ONLY EXAMPLE USE
const NameAlreadyExists = require('../../exceptions/example-name-already-exists')
const ExampleNameRequired = require('../../exceptions/example-name-is-required')

class Add {
  /**
   *
   * @param {ExampleRepository} repository
   * @param {winston.Logger} logger
   */
  constructor(repository, logger) {
    this.repository = repository
    this.logger = logger

    this.getLoggerContainer = this.getLoggerContainer.bind(this)
    this.execute = this.execute.bind(this)
  }

  /**
   *
   * @param {Example} example
   * @return {Promise<Example>}
   */
  async execute(example) {
    this.logger.info('Adding new example')

    // REPOSITORY
    const nameAlreadyExist = await this.repository.getByName(example.name)
    // BUSINESS EXCEPTIONS
    if (!example.name) throw new ExampleNameRequired()
    if (nameAlreadyExist) throw new NameAlreadyExists()
    // REPOSITORY
    const newExample = await this.repository.save(
      new Example({ id: new ObjectId().toHexString(), ...example, createdAt: new Date() })
    )

    this.logger.info('New example added succesfully')

    return newExample
  }

  /**
   * @return {winston.Logger}
   */
  getLoggerContainer() {
    return this.logger
  }
}

module.exports = Add
