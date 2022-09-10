/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Collapse, Col, Container, Row } from 'react-bootstrap';
import { Team } from 'shared';
import { useTheme } from '../../hooks/Theme.hooks';
import { routes } from '../../utils/Routes';
import { fullNamePipe, listPipe, wbsPipe } from '../../utils/Pipes';
import styles from '../../stylesheets/pages/ProjectDetailPage/WorkPackageSummary.module.scss';
import ReactMarkdown from 'react-markdown';
import PageBlock from '../../layouts/PageBlock';

const DESCRIPTION_WORD_LIMIT = 100;

interface TeamSummaryProps {
  team: Team;
}

const TeamSummary: React.FC<TeamSummaryProps> = ({ team }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const membersList = listPipe(team.members, (t) => fullNamePipe(t));

  const projectsList = team.projects.map((project, idx) => (
    <>
      <Link to={`${routes.PROJECTS}/${wbsPipe(project.wbsNum)}`}>{project.name}</Link>
      {idx + 1 !== team.projects.length ? ', ' : ''}
    </>
  ));

  let description = team.description;
  let descriptionTooLong = false;
  if (description.split(' ').length > DESCRIPTION_WORD_LIMIT) {
    descriptionTooLong = true;
    description = description.split(' ').slice(0, DESCRIPTION_WORD_LIMIT).join(' ') + '\u2026';
  }

  return (
    <Card bg={theme.cardBg} border={theme.cardBorder}>
      <Card.Header className={styles.header} onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className={'d-flex justify-content-between'}>
          <div className={'d-flex'}>
            <Link to={`${routes.TEAMS}/${team.teamId}`}>{team.teamName}</Link>
          </div>
          <div className={'d-flex'}>
            <div className={'mr-3'}>
              {team.projects.length} Project{team.projects.length === 1 ? '' : 's'}
            </div>
            <div>
              {team.members.length} Member{team.members.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </Card.Header>

      <Collapse in={open}>
        <div>
          <Card.Body>
            <Container fluid>
              <Row>
                <Col xs={12} md={6}>
                  <b>Lead:</b> {fullNamePipe(team.leader)}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <b>Members:</b> {membersList}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <b>Projects:</b> {projectsList}
                </Col>
              </Row>
              {description && (
                <Row className={styles.description}>
                  <Col>
                    <PageBlock title="">
                      <ReactMarkdown>{description}</ReactMarkdown>
                      {descriptionTooLong && (
                        <Link to={`${routes.TEAMS}/${team.teamId}`}>{`(continue reading)`}</Link>
                      )}
                    </PageBlock>
                  </Col>
                </Row>
              )}
            </Container>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default TeamSummary;
