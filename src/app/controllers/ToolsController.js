import * as Yup from 'yup';
import Tool from '../models/Tool';

class ToolsController {
  async index(request, response) {
    const { tag } = request.query;

    if (tag) {
      const toolsByTag = await Tool.find({ tags: tag });
      return response.json({ tools: toolsByTag, filter: tag });
    }
    const tools = await Tool.find();

    return response.json(tools);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      link: Yup.string().url().required(),
      description: Yup.string(),
      tags: Yup.array().of(Yup.string()),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation Fails' });
    }
    const { title, link, description, tags } = request.body;

    const tool = await Tool.create({
      title,
      link,
      description,
      tags,
    });
    return response.status(201).json(tool);
  }

  async destroy(request, response) {
    const { id } = request.params;

    const tool = await Tool.findById(id);

    if (!tool) {
      return response.status(400).json({ error: 'Tool not found' });
    }

    await tool.remove();

    return response.status(204).send();
  }
}

export default new ToolsController();
